(function(){
  'use strict';

  var deck = window.MRKD_DECK;
  var notes = window.MRKD_PRESENTER_NOTES;
  if (!deck || !notes || notes.slides.length !== deck.count) return;

  var params = new URLSearchParams(location.search);
  var audience = params.get('audience') === '1';
  var session = audience ? params.get('session') : null;
  var audienceWindow = null;
  var channel = null;
  var connected = false;
  var presenterIndex = deck.getIndex();
  var startedAt = 0;
  var timer = null;
  var shell = document.getElementById('presenter-shell');
  var script = document.getElementById('ps-script');
  var status = document.getElementById('ps-connection');
  var reopen = document.getElementById('ps-reopen');
  var moveScreen = document.getElementById('ps-move-screen');

  function clamp(index){ return Math.max(0, Math.min(deck.count - 1, index)); }
  function escapeHTML(value){
    return String(value).replace(/[&<>"']/g, function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function inlineMarkdown(value){
    return escapeHTML(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  function setStatus(message, isConnected){
    connected = !!isConnected;
    status.textContent = message;
    status.classList.toggle('connected', connected);
    reopen.hidden = connected || !session;
  }
  function openChannel(){
    if (!session || !('BroadcastChannel' in window)) return;
    try {
      channel = new BroadcastChannel('mrkd-present-' + session);
      channel.onmessage = function(event){ receive(event.data, null); };
    } catch (_) { channel = null; }
  }
  function send(kind, index){
    if (!session) return;
    var payload = { app:'mrkd-present', session:session, kind:kind, index:index };
    if (channel) channel.postMessage(payload);
    var peer = audience ? window.opener : audienceWindow;
    if (peer && !peer.closed) peer.postMessage(payload, '*');
  }
  function receive(payload, source){
    if (!payload || payload.app !== 'mrkd-present' || payload.session !== session) return;
    if (audience){
      if (payload.kind === 'set' && Number.isInteger(payload.index)){
        deck.goTo(clamp(payload.index), 'instant');
        send('state', deck.getIndex());
      } else if (payload.kind === 'end') {
        window.close();
      }
      return;
    }
    if (!document.body.classList.contains('presenter-mode')) return;
    if (source && audienceWindow && source !== audienceWindow) return;
    if (source && !audienceWindow) audienceWindow = source;
    if (payload.kind === 'ready'){
      setStatus('Audience connected', true);
      send('set', presenterIndex);
    } else if (payload.kind === 'state' && Number.isInteger(payload.index)){
      setStatus('Audience connected', true);
      if (presenterIndex !== payload.index) showSlide(payload.index, false);
    } else if (payload.kind === 'closed'){
      setStatus('Audience window closed', false);
    }
  }
  window.addEventListener('message', function(event){
    if (event.origin !== location.origin && event.origin !== 'null') return;
    if (audience && window.opener && event.source !== window.opener) return;
    receive(event.data, event.source);
  });

  function sectionHTML(section){
    var isCue = !/^say/i.test(section.label);
    return '<section class="ps-section' + (isCue ? ' ps-section--cue' : '') + '">' +
      '<h2>' + escapeHTML(section.label) + '</h2>' +
      section.paragraphs.map(function(paragraph){ return '<p>' + inlineMarkdown(paragraph) + '</p>'; }).join('') +
      '</section>';
  }
  function showSlide(index, broadcast){
    presenterIndex = clamp(index);
    var note = notes.slides[presenterIndex];
    var next = notes.slides[presenterIndex + 1];
    document.getElementById('ps-count').textContent = String(presenterIndex + 1).padStart(2, '0') + ' / ' + deck.count;
    document.getElementById('ps-target').textContent = 'TARGET ' + note.time;
    document.getElementById('ps-title').textContent = note.title;
    document.getElementById('ps-next-title').textContent = next ? next.title : 'Workshop / discussion';
    document.getElementById('ps-next-number').textContent = next ? 'SLIDE ' + String(presenterIndex + 2).padStart(2, '0') : 'AFTER THE TALK';
    script.innerHTML = note.sections.map(sectionHTML).join('') +
      (next ? '' : sectionHTML({label:'Workshop / demo transition', paragraphs:notes.transition}));
    script.scrollTop = 0;
    document.getElementById('ps-prev').disabled = presenterIndex === 0;
    document.getElementById('ps-next').disabled = presenterIndex === deck.count - 1;
    document.getElementById('ps-progress').style.width = ((presenterIndex + 1) / deck.count * 100) + '%';
    if (broadcast) send('set', presenterIndex);
  }

  function audienceURL(){
    var url = new URL(location.href);
    url.searchParams.set('audience', '1');
    url.searchParams.set('session', session);
    url.searchParams.set('slide', String(presenterIndex + 1));
    return url.href;
  }
  function openAudience(){
    audienceWindow = window.open(audienceURL(), 'mrkd-audience-' + session,
      'popup=yes,width=1280,height=720,resizable=yes,scrollbars=no');
    if (!audienceWindow){
      setStatus('Pop-up blocked — allow pop-ups and try again', false);
      window.alert('Allow pop-ups for this site, then press P again.');
      return false;
    }
    setStatus('Waiting for audience window…', false);
    return true;
  }
  async function placeOnSecondScreen(){
    if (!audienceWindow || audienceWindow.closed || !('getScreenDetails' in window)) return;
    try {
      // A supporting browser asks permission the first time. The second
      // display is chosen relative to the laptop screen, not a guessed x/y.
      var details = await window.getScreenDetails();
      var target = details.screens.find(function(screen){
        return screen.left !== details.currentScreen.left || screen.top !== details.currentScreen.top;
      });
      if (!target){
        setStatus('Only one screen detected — drag the audience window if needed', connected);
        return;
      }
      audienceWindow.moveTo(target.availLeft, target.availTop);
      audienceWindow.resizeTo(target.availWidth, target.availHeight);
      setStatus('Placement requested — check the audience screen, then click Full', connected);
    } catch (_) {
      setStatus('Drag the audience window to your second screen', connected);
    }
  }
  function enterPresenter(){
    presenterIndex = deck.getIndex();
    session = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() :
      String(Date.now()) + '-' + Math.random().toString(36).slice(2);
    openChannel();
    if (!openAudience()){
      if (channel) channel.close();
      channel = null; session = null;
      return;
    }
    document.body.classList.add('presenter-mode');
    shell.setAttribute('aria-hidden', 'false');
    showSlide(presenterIndex, false);
    if ('getScreenDetails' in window && window.screen && window.screen.isExtended){
      placeOnSecondScreen();
    }
    startedAt = Date.now();
    if (timer) clearInterval(timer);
    timer = setInterval(function(){
      var seconds = Math.floor((Date.now() - startedAt) / 1000);
      document.getElementById('ps-timer').textContent =
        String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
      if (audienceWindow && audienceWindow.closed && connected){
        setStatus('Audience window closed', false);
      }
    }, 1000);
  }
  function endPresenter(){
    send('end', presenterIndex);
    if (audienceWindow && !audienceWindow.closed) audienceWindow.close();
    if (channel) channel.close();
    channel = null; audienceWindow = null; session = null;
    clearInterval(timer); timer = null;
    document.body.classList.remove('presenter-mode');
    shell.setAttribute('aria-hidden', 'true');
    deck.goTo(presenterIndex, 'instant');
  }

  if (audience){
    document.body.classList.add('audience-mode');
    var requested = Number(params.get('slide'));
    if (Number.isInteger(requested) && requested >= 1) deck.goTo(requested - 1, 'instant');
    openChannel();
    document.addEventListener('mrkd:slidechange', function(event){
      send('state', event.detail.index);
    });
    send('ready', deck.getIndex());
    window.addEventListener('pagehide', function(){ send('closed', deck.getIndex()); });
    return;
  }

  document.getElementById('present').addEventListener('click', enterPresenter);
  // The Present mode button is hidden so the audience never sees it; P opens
  // the presenter view instead. Modifier combinations are left alone so that
  // Ctrl/Cmd+P still prints, and typing in a field never triggers it.
  window.addEventListener('keydown', function(event){
    if (event.key !== 'p' && event.key !== 'P') return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (document.body.classList.contains('presenter-mode')) return;
    var target = event.target;
    var tag = target && target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (target && target.isContentEditable)) return;
    event.preventDefault();
    enterPresenter();
  });
  document.getElementById('ps-exit').addEventListener('click', endPresenter);
  reopen.addEventListener('click', function(){
    if (openAudience() && 'getScreenDetails' in window && window.screen && window.screen.isExtended){
      placeOnSecondScreen();
    }
  });
  moveScreen.hidden = !('getScreenDetails' in window);
  moveScreen.addEventListener('click', placeOnSecondScreen);
  document.getElementById('ps-prev').addEventListener('click', function(){ showSlide(presenterIndex - 1, true); });
  document.getElementById('ps-next').addEventListener('click', function(){ showSlide(presenterIndex + 1, true); });
  var cheat = document.getElementById('ps-cheat');
  cheat.innerHTML = notes.cheat.map(function(line){ return '<p>' + inlineMarkdown(line) + '</p>'; }).join('');
  document.getElementById('ps-cheat-toggle').addEventListener('click', function(){
    cheat.hidden = !cheat.hidden;
    this.setAttribute('aria-expanded', String(!cheat.hidden));
  });
  var timing = document.getElementById('ps-timing');
  timing.innerHTML = notes.timing.map(function(line){ return '<p>' + inlineMarkdown(line) + '</p>'; }).join('');
  document.getElementById('ps-timing-toggle').addEventListener('click', function(){
    timing.hidden = !timing.hidden;
    this.setAttribute('aria-expanded', String(!timing.hidden));
  });
  window.addEventListener('keydown', function(event){
    if (!document.body.classList.contains('presenter-mode')) return;
    var tag = event.target && event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' ||
        (tag === 'BUTTON' && (event.key === ' ' || event.key === 'Enter'))) return;
    var step = 0;
    if (['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)) step = 1;
    if (['ArrowLeft','ArrowUp','PageUp'].includes(event.key)) step = -1;
    if (step){ event.preventDefault(); showSlide(presenterIndex + step, true); }
    else if (event.key === 'Home'){ event.preventDefault(); showSlide(0, true); }
    else if (event.key === 'End'){ event.preventDefault(); showSlide(deck.count - 1, true); }
  });
})();
