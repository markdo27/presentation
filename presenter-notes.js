// Presenter notes supplied for the Happiness Saigon workshop.
window.MRKD_PRESENTER_NOTES = {
  "slides": [
    {
      "number": 1,
      "title": "OPENING",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Hey everyone. I’m Mark.",
            "I’m a designer. I’m not a developer, and I think that’s probably the most important thing to say before we start.",
            "For most of my career, when I had an idea for a digital tool, the normal process was: sketch it, explain it to somebody technical, wait for it to be built, test it, send feedback, wait again.",
            "About six months ago, that relationship changed quite dramatically for me.",
            "I started experimenting with AI coding agents, mostly just out of curiosity.",
            "And somehow that curiosity turned into sixteen little tools.",
            "Some are useful. Some are stupid. Some are probably useful because they’re stupid.",
            "But the important thing is: they exist.",
            "Today I want to show you less about “how to code with AI” and more about **what happens when a designer suddenly has the ability to build their own tools.**",
            "That’s the part I find interesting."
          ]
        }
      ]
    },
    {
      "number": 2,
      "title": "SIX MONTHS BY THE NUMBERS",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "So, quick context.",
            "Six months.",
            "Sixteen tools.",
            "Five different categories.",
            "And zero dollars to publish them.",
            "Just to clarify: **zero dollars to publish.**",
            "My AI subscriptions are definitely not zero dollars. Unfortunately.",
            "But hosting these experiments on things like GitHub Pages and Vercel means I can have an idea tonight, build something, and tomorrow send somebody a URL.",
            "That speed changed the way I think about experimentation.",
            "Before, I would ask:",
            "“Is this idea worth building?”",
            "Now I usually ask:",
            "“Can I make something rough enough to test tonight?”",
            "That is a very different creative mindset."
          ]
        }
      ]
    },
    {
      "number": 3,
      "title": "AGENDA",
      "time": "0:40",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "I’ll start with the experiment that got me into this.",
            "Then I’ll explain what I mean when I say “vibecoding,” because the word is becoming a little bit abused.",
            "We’ll look at the three agents I currently use.",
            "Then I’ll show the workflow I normally follow.",
            "After that, instead of showing sixteen tools one by one, I want to go deeper into two projects.",
            "Liquid.Font is the fun one.",
            "Vinafont is the one where everything became much more complicated.",
            "And at the end I’ll share what I think actually matters after doing this for six months."
          ]
        }
      ]
    },
    {
      "number": 4,
      "title": "WHAT IF A DESIGN TOOL COULD ANIMATE ITSELF?",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "It actually started from a very simple question.",
            "**What if a design tool could animate itself?**",
            "I had been looking at Space Type Generator.",
            "And what interested me wasn’t only the visual output.",
            "I liked the feeling of playing with it.",
            "You change something and immediately something happens.",
            "You’re not making one finished design.",
            "You’re building a little system that can produce many designs.",
            "And I remember thinking:",
            "“I want this. But I want my version of this.”",
            "Normally that thought would stop there.",
            "Maybe I’d put it in a folder called “ideas.”",
            "You know that folder.",
            "The graveyard.",
            "But this time I opened an AI coding agent and tried describing what I wanted.",
            "And that became the first experiment."
          ]
        }
      ]
    },
    {
      "number": 5,
      "title": "VIBECODING, DEFINED",
      "time": "2:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "When I say vibecoding, I don’t mean:",
            "“Write one magical prompt and the computer makes your app.”",
            "That has basically never happened to me.",
            "My process is much closer to working with a junior designer or creative technologist who is incredibly fast, has read everything on the internet, and occasionally does something completely insane.",
            "I describe the idea.",
            "It builds something.",
            "I open it.",
            "I look at it.",
            "I say:",
            "“No. Not like that.”",
            "And then we keep going.",
            "So the prompt is not really the work.",
            "**The feedback loop is the work.**",
            "AI writes a lot of the code.",
            "But I’m still deciding what feels good, what feels wrong, what stays and what gets deleted.",
            "A line I would remember here is:",
            "**AI writes the code. I decide what survives.**",
            "And for me, that is still design."
          ]
        }
      ]
    },
    {
      "number": 6,
      "title": "THREE AGENTS",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "I currently move between three tools.",
            "Antigravity, Claude and Codex.",
            "I don’t really treat this like a model competition.",
            "I don’t care who is number one on Twitter this week.",
            "I care about which one helps me do the job in front of me.",
            "Antigravity is useful when I want it to build something and then actually inspect the browser.",
            "Claude is usually where I go when I have a complicated repository and I want to understand the problem deeply before touching anything.",
            "Codex I use a lot for focused tasks running alongside everything else.",
            "One might be fixing an interaction.",
            "Another might be cleaning up typography.",
            "Another could be investigating why the export is broken.",
            "So instead of looking for one AI that does everything, I’ve started treating them more like a small creative production team.",
            "Different personalities.",
            "Different strengths.",
            "Also occasionally different ways of destroying my code."
          ]
        }
      ]
    },
    {
      "number": 7,
      "title": "IDEA TO DEPLOY",
      "time": "2:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Almost every tool follows the same loop.",
            "First: **spark.**",
            "Something annoys me. Something takes too long. Or I see something and think, “I wonder if I can make that.”",
            "Second: **prompt.**",
            "I try to explain not only what it should do, but what it should feel like.",
            "That part matters.",
            "Third: **build.**",
            "I don’t spend too much time trying to create the perfect prompt. I want something visible as fast as possible.",
            "Because once I can see it, I can design it.",
            "Fourth: **polish.**",
            "This is usually where most of my time goes.",
            "Typography.",
            "Spacing.",
            "Motion.",
            "Interactions.",
            "Edge cases.",
            "All the things AI loves to say are “done” when they are absolutely not done.",
            "And finally: **deploy.**",
            "Put it online.",
            "Send somebody the URL.",
            "Watch them use it incorrectly.",
            "Then learn something.",
            "That loop is really the entire workshop."
          ]
        }
      ]
    },
    {
      "number": 8,
      "title": "16 TOOLS / 5 CATEGORIES",
      "time": "0:50",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "After about six months, I looked back and realized I had made sixteen of these things.",
            "I didn’t deliberately plan sixteen products.",
            "They’re mostly responses to small problems.",
            "Type.",
            "Print and pattern.",
            "Sound and visual.",
            "Figma utilities.",
            "Data and documents.",
            "And I actually think the smallness is important.",
            "I’m not trying to build the next Adobe.",
            "Please, nobody needs me to build the next Adobe.",
            "I’m trying to build **one useful behavior at a time.**"
          ]
        }
      ]
    },
    {
      "number": 9,
      "title": "TYPE",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "These were some of the first ones.",
            "Circle is basically a modular typeface builder.",
            "Typoman lets me play with kinetic typography.",
            "And then Liquid.Font became a much deeper rabbit hole.",
            "A thing I learned very quickly is that typography is perfect for these experiments because type is already a system.",
            "There are rules.",
            "Relationships.",
            "Constraints.",
            "And then there is the human part where you look at it and say:",
            "“That R looks terrible.”",
            "That last part is difficult to automate."
          ]
        }
      ]
    },
    {
      "number": 10,
      "title": "PRINT & PATTERN",
      "time": "0:50",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Then things became more playful.",
            "Poster generators.",
            "Mosaics.",
            "Patterns.",
            "Thermal typography.",
            "Vietnamese signage.",
            "These tools are less about solving some gigantic production problem.",
            "A lot of them are simply machines for producing accidents.",
            "And I think that’s valuable.",
            "Because when software becomes too efficient, sometimes everything starts looking predictable.",
            "A tool can also exist just to create conditions where something unexpected happens."
          ]
        }
      ]
    },
    {
      "number": 11,
      "title": "SOUND, VISUAL, DATA",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Then I started leaving graphic design.",
            "I made a little music sequencer.",
            "A VJ tool.",
            "A lottery-data experiment.",
            "A document translator.",
            "And that was the point where I realized:",
            "The important skill I was learning wasn't coding.",
            "It was learning how to describe **systems.**",
            "Input.",
            "Behavior.",
            "Rules.",
            "Output.",
            "Feedback.",
            "Once you start thinking that way, a poster generator and a MIDI sequencer aren’t actually that different."
          ]
        }
      ]
    },
    {
      "number": 12,
      "title": "FIGMA PLUGINS",
      "time": "0:50",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "And eventually I started making tools for software I already use.",
            "EPS importer.",
            "PDF importer.",
            "Website importer.",
            "These are not sexy projects.",
            "Nobody is putting the PDF importer on a Behance case study.",
            "But sometimes the boring tool is the useful one.",
            "And this is another shift AI has created for me.",
            "Previously, building a utility that saves five minutes might not justify development time.",
            "Now it might.",
            "If something annoys you every Tuesday, you can potentially just fix Tuesday."
          ]
        }
      ]
    },
    {
      "number": 13,
      "title": "LIQUID.FONT INTRO",
      "time": "0:45",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "So this is the first project I want to unpack properly.",
            "Liquid.Font.",
            "The idea sounds simple:",
            "I wanted to make these swollen, Y2K, liquid-looking letters.",
            "But instead of generating an image, I wanted an actual alphabet.",
            "Something editable.",
            "Something consistent.",
            "And ideally something I could export and type with."
          ]
        }
      ]
    },
    {
      "number": 14,
      "title": "THE IDEA",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "My first approach was basically visual effects.",
            "Blur shapes.",
            "Merge them.",
            "Get something gooey.",
            "It looked cool.",
            "But it wasn't really typography.",
            "If I changed one letter, I had to manually fix everything around it.",
            "So eventually I realized the actual brief wasn't:",
            "“Make liquid letters.”",
            "The brief was:",
            "**“Give me a system that controls how letters melt.”**",
            "That change in wording completely changed the tool.",
            "And this happens constantly when working with AI.",
            "Sometimes the first job isn't building the answer.",
            "It's discovering the correct question."
          ]
        }
      ]
    },
    {
      "number": 15,
      "title": "THE BUILD",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Eventually each letter became a skeleton.",
            "Instead of drawing the final outline, I define points.",
            "Those points have size.",
            "Connections between them create the stroke.",
            "And the engine generates the soft shape around that structure.",
            "Think of it less like drawing a letter with Illustrator paths and more like giving the letter bones.",
            "Then the software grows the body around them.",
            "Once I had that, suddenly the design became editable.",
            "Move the bone, the letter changes.",
            "Change the radius, the weight changes.",
            "Now I had a system."
          ]
        }
      ]
    },
    {
      "number": 16,
      "title": "HOW THE ENGINE WORKS",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "This slide looks technical.",
            "Don’t worry.",
            "There will be no exam.",
            "The important idea is simply this:",
            "I define a skeleton.",
            "The system turns those lines into soft tubes.",
            "Those tubes melt together.",
            "Then the computer finds the outside edge.",
            "Then it smooths that edge.",
            "And finally it gives me something I can export.",
            "Skeleton.",
            "Body.",
            "Melt.",
            "Outline.",
            "Font.",
            "That’s basically it.",
            "The funny thing is I didn't know “marching squares” or “smooth minimum union” before starting this.",
            "AI let me work backwards.",
            "I knew the visual behavior I wanted.",
            "Then through building it, I started learning the technical concepts necessary to create that behavior.",
            "That’s been much more useful to me than trying to learn programming abstractly."
          ]
        }
      ]
    },
    {
      "number": 17,
      "title": "THREE FEELS",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Once the engine existed, one alphabet could produce different personalities.",
            "Bubble.",
            "Liquid.",
            "Molten.",
            "Same underlying structure.",
            "Different parameters.",
            "And this is where tool-making gets very close to art direction.",
            "Because you're no longer designing one letter.",
            "You're designing a **space of possible letters.**",
            "You're deciding how far the system is allowed to move."
          ]
        }
      ]
    },
    {
      "number": 18,
      "title": "NODES",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Here you can see the structure directly.",
            "The left side is basically the DNA.",
            "The right side is what gets generated.",
            "And something as small as moving one point can change the silhouette dramatically.",
            "This is a really important idea for me.",
            "When I work traditionally, I design the result.",
            "When I build these tools, I’m often designing the **cause** of the result."
          ]
        }
      ]
    },
    {
      "number": 19,
      "title": "ONE EDIT, FOUR LETTERS",
      "time": "2:00 + optional demo",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "This was an experiment I really liked.",
            "If several letters share similar structures, what happens if one edit propagates through the family?",
            "Change B.",
            "D, H and P react.",
            "Now I'm not editing isolated letters anymore.",
            "I'm designing relationships between letters."
          ]
        },
        {
          "label": "DEMO CUE",
          "paragraphs": [
            "**[PAUSE AND DEMO THIS IF POSSIBLE.]**"
          ]
        },
        {
          "label": "Say during demo",
          "paragraphs": [
            "This is probably the moment where I would stop explaining and just play with it.",
            "Because the whole point of the tool is the feedback.",
            "Move this.",
            "Everything changes.",
            "Undo.",
            "Try something stupid.",
            "Sometimes stupid is good."
          ]
        }
      ]
    },
    {
      "number": 20,
      "title": "INTO PRODUCTION",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "And eventually this became a real little production tool.",
            "It exports.",
            "It has tests.",
            "It runs online.",
            "You can download an OTF.",
            "The whole thing took around four weeks of evenings.",
            "And this was important psychologically.",
            "Because at some point it stopped feeling like an AI experiment.",
            "It was just software I had made.",
            "That was a weird moment."
          ]
        }
      ]
    },
    {
      "number": 21,
      "title": "VINAFONT INTRO",
      "time": "0:50",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Liquid.Font was mostly about play.",
            "Vinafont started from frustration.",
            "You find a beautiful Latin typeface.",
            "You type Vietnamese.",
            "And suddenly...",
            "Nope.",
            "Half the characters you need don’t exist.",
            "So I thought:",
            "Could I build something that helps fill that gap?",
            "This ended up being much harder."
          ]
        }
      ]
    },
    {
      "number": 22,
      "title": "THE PROBLEM",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Vietnamese is interesting because we're using Latin letters, but with a much more complex system of marks.",
            "You might need a circumflex.",
            "Then a tone above the circumflex.",
            "You have dots below.",
            "And then we have characters like ơ and ư where the horn actually connects to the letter.",
            "So you can’t just throw an accent somewhere above the glyph.",
            "It needs to feel like the same designer created it.",
            "That became the real challenge.",
            "**The letters shouldn't only exist. They should belong.**"
          ]
        }
      ]
    },
    {
      "number": 23,
      "title": "HOW THE APPROACH CHANGED",
      "time": "1:40",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "My first instinct was very AI:",
            "“Let's generate the missing shapes.”",
            "Technically it worked.",
            "Visually it sucked.",
            "And I think this slide is one of the most important in the presentation.",
            "Because the machine passed the technical test.",
            "The designer failed it.",
            "So I changed the approach.",
            "Instead of inventing accents, I started asking:",
            "Can we find evidence inside real fonts?",
            "Can we extract an accent that already exists?",
            "Can we borrow a shape from an appropriate reference?",
            "Can we measure how professional type designers solved the same problem?",
            "The project changed from **generation** to **matching.**"
          ]
        }
      ]
    },
    {
      "number": 24,
      "title": "BUILD MAP",
      "time": "1:10",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "The tool eventually became a decision tree.",
            "Read the font.",
            "Understand what exists.",
            "Find the best mark.",
            "Build the missing characters.",
            "Proof everything.",
            "This is where I started getting much more systematic with AI.",
            "Instead of telling the agent:",
            "“Make Vietnamese work.”",
            "I could give it smaller questions.",
            "How do we inspect the font?",
            "How do we identify marks?",
            "How do we compare proportions?",
            "How do we place stacked accents?",
            "Each question became a part of the system."
          ]
        }
      ]
    },
    {
      "number": 25,
      "title": "FINDING THE RIGHT MARK",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "And I created a hierarchy.",
            "Best case: the user gives us a reference.",
            "Next: the mark already exists somewhere in the font.",
            "Even better, sometimes you can literally extract it.",
            "If a font contains both o and ơ, subtracting one shape from the other can reveal the horn.",
            "Which is kind of ridiculous.",
            "But it works.",
            "Then there's a library of real fonts to find something stylistically close.",
            "And only when all of that fails do we generate a mark.",
            "So generation went from being the main idea to being the last resort."
          ]
        }
      ]
    },
    {
      "number": 26,
      "title": "STACKED LETTER",
      "time": "1:10",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "This is where Vietnamese gets fun.",
            "Or horrible.",
            "Depending on your mood.",
            "Here we have:",
            "a.",
            "Add circumflex: â.",
            "Add acute tone: ấ.",
            "The construction sounds easy.",
            "But if the first mark is too tall...",
            "or the second is too low...",
            "or they're horizontally misaligned...",
            "the whole glyph immediately feels wrong.",
            "Typography is full of problems that are mathematically tiny and visually huge."
          ]
        }
      ]
    },
    {
      "number": 27,
      "title": "THE HORN",
      "time": "1:10",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "And the horn is particularly annoying.",
            "Because this isn't simply a floating accent.",
            "It physically joins the letter.",
            "That connection needs to look intentional.",
            "Then you might need another tone above it.",
            "So now you're managing not only geometry but rhythm and negative space.",
            "This is where “technically correct” becomes almost meaningless.",
            "It has to look right."
          ]
        }
      ]
    },
    {
      "number": 28,
      "title": "PROOFING",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "And this taught me another lesson.",
            "Never evaluate a typeface one glyph at a time.",
            "Put it into words.",
            "Put words into sentences.",
            "Suddenly problems become obvious.",
            "Something that looks beautiful by itself can completely destroy the rhythm of a line.",
            "Same thing happens in design generally.",
            "A component can be perfect.",
            "The system can still be terrible."
          ]
        }
      ]
    },
    {
      "number": 29,
      "title": "LIVE FONT",
      "time": "2:30–4:00 demo",
      "sections": [
        {
          "label": "DEMO CUE",
          "paragraphs": [
            "**[DEMO HERE.]**"
          ]
        },
        {
          "label": "Say during demo",
          "paragraphs": [
            "This is where I’d actually upload something.",
            "Take a Latin font.",
            "Drop it in.",
            "And now the browser tries to build Vietnamese characters from what it can discover.",
            "What I like about doing this live is that it isn't guaranteed to look perfect.",
            "And that's the point.",
            "The output is a draft.",
            "We are not trying to remove the designer.",
            "We're trying to move the designer further down the process.",
            "Instead of manually constructing 135 glyphs just to see whether the idea works, I can get a first pass and immediately start judging."
          ]
        }
      ]
    },
    {
      "number": 30,
      "title": "BENCHMARK",
      "time": "1:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "Eventually I had another problem.",
            "I kept changing the algorithm.",
            "But I couldn't answer a simple question:",
            "**Is it actually getting better?**",
            "So I made a benchmark.",
            "Take professionally designed fonts that already contain Vietnamese.",
            "Hide the Vietnamese glyphs from the system.",
            "Ask Vinafont to rebuild them.",
            "Then compare what it generates against what the original designer actually drew.",
            "Across this test, about 82.8% landed within the benchmark’s 10% threshold, with a median difference around 5.1%.",
            "But the number isn't the important part.",
            "The important thing is now I have **feedback that isn't just my opinion.**",
            "It shows me where the system is weak.",
            "Circumflex needs more work.",
            "The Đ stroke needs more work.",
            "Now I know where to spend the next hour."
          ]
        }
      ]
    },
    {
      "number": 31,
      "title": "WHAT IT CANNOT DO",
      "time": "1:20",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "And I deliberately put this slide in here because AI presentations sometimes magically skip this part.",
            "Vinafont is not finished.",
            "It loses things.",
            "Kerning.",
            "Hinting.",
            "Variable axes.",
            "Colour tables.",
            "And you absolutely need to check font licenses before modifying or redistributing anything.",
            "So I don't think of Vinafont as:",
            "“Press button, get perfect Vietnamese font.”",
            "It's:",
            "**Get a useful draft much faster, then use your eyes.**",
            "And I think that's a healthier way to think about many AI tools.",
            "Not replacement.",
            "Compression.",
            "Compress the boring distance between idea and something you can judge."
          ]
        }
      ]
    },
    {
      "number": 32,
      "title": "VIETNAMESE SIGN WALL",
      "time": "2:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "This one is closer to home.",
            "I started noticing how many Vietnamese street signs are slowly becoming visually similar.",
            "Especially now that small businesses can generate graphics very easily.",
            "And weirdly, it made me miss the old badly designed signs.",
            "Five fonts.",
            "Three outlines.",
            "Everything stretched.",
            "Absolutely illegal typography.",
            "But somehow... character.",
            "So I made Saigon 1985 as a way of playing with that visual language.",
            "You can resize the storefronts, edit the text, switch between old painted boards and later vinyl signage.",
            "And this is something I want to explore more.",
            "AI doesn't only have to create futuristic aesthetics.",
            "We can also use new technology to explore **very local visual culture.**",
            "And I think there's a huge amount of material in Vietnam that hasn't been turned into creative tools yet."
          ]
        }
      ]
    },
    {
      "number": 33,
      "title": "WHAT SIX MONTHS TAUGHT ME",
      "time": "2:30",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "So after sixteen tools, four things stayed with me.",
            "First:",
            "**Your eye still matters.**",
            "AI can make something function while making something visually terrible.",
            "That problem is not disappearing.",
            "Second:",
            "**Iteration became almost free.**",
            "Not literally free in money.",
            "But cheap enough that I can try weird directions without needing to defend the idea first.",
            "Third:",
            "**Keep things small enough to finish.**",
            "This is probably the biggest one.",
            "Every time I try to build one giant platform, everything becomes painful.",
            "The useful tools started with one behavior.",
            "One annoying problem.",
            "One curiosity.",
            "And fourth:",
            "**Measure when you can.**",
            "My Vinafont benchmark completely changed how I directed the project.",
            "Instead of saying “make it better,” I could point to where it was failing."
          ]
        }
      ]
    },
    {
      "number": 34,
      "title": "NEXT",
      "time": "1:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "There are a few things I want to continue.",
            "Vinafont needs a real production export pipeline.",
            "I want Liquid.Font to move, maybe letters responding to forces and motion.",
            "I want to expand the Saigon signage project.",
            "And I'm currently interested in building tools outside traditional graphic design.",
            "For example, I've been thinking about a running app where music reacts to pace and helps control breathing rhythm.",
            "I have no idea whether that one will work.",
            "Which is exactly why I want to build it."
          ]
        }
      ]
    },
    {
      "number": 35,
      "title": "TRY IT YOURSELF",
      "time": "3:00",
      "sections": [
        {
          "label": "Say",
          "paragraphs": [
            "So I want to leave you with one idea.",
            "When people talk about AI and creativity, the conversation is usually:",
            "**“What can AI make for me?”**",
            "Image.",
            "Video.",
            "Copy.",
            "Layout.",
            "I think there's another question that is more interesting:",
            "**“What can I build for the way I create?”**",
            "Maybe there is something your team repeats every week.",
            "Maybe there's a stupid production task everybody hates.",
            "Maybe there's a visual idea you've wanted to play with but it was never important enough to justify development.",
            "That is exactly the kind of thing I would try now.",
            "Don't start by building a platform.",
            "Build something embarrassingly small.",
            "Make one button work.",
            "Make one interaction feel good.",
            "Send the URL to somebody.",
            "Watch them break it.",
            "Then build the next thing.",
            "The biggest change for me over these six months is not that AI taught me how to become a developer.",
            "I still don't really consider myself one.",
            "It gave me a way to turn design decisions into functioning systems.",
            "And that means, as designers, maybe our output doesn't always have to be the poster.",
            "Or the identity.",
            "Or the website.",
            "**Sometimes the thing we design can be the tool that designs the thing.**",
            "Thank you.",
            "Let’s break some software."
          ]
        }
      ]
    }
  ],
  "transition": [
    "Instead of going directly into normal Q&A, I’d say:",
    "Okay. Rather than me continuing to talk about making tools, let's actually make something.",
    "Think about your own workflow.",
    "Not your biggest problem.",
    "Actually, choose something small and slightly annoying.",
    "Something you currently do manually.",
    "Something you wish existed.",
    "Or just a visual behavior you've always wanted to play with.",
    "We’ll pick one and turn it into a very rough tool.",
    "The goal is not to finish an app today.",
    "The goal is to go from:",
    "**“It would be cool if...”**",
    "to",
    "**something running in a browser.**",
    "That first jump is the important one."
  ],
  "cheat": [
    "**“What if a design tool could animate itself?”**",
    "**“The feedback loop is the work.”**",
    "**“AI writes the code. I decide what survives.”**",
    "**“Give me a system that controls how letters melt.”**",
    "**“The letters shouldn't only exist. They should belong.”**",
    "**“Is it actually getting better?”**",
    "**“Get a useful draft much faster, then use your eyes.”**",
    "**“Your eye still matters.”**",
    "**“Iteration became almost free.”**",
    "**“Keep things small enough to finish.”**",
    "**“Measure when you can.”**",
    "**“What can AI make for me?”**",
    "**“What can I build for the way I create?”**",
    "**“Sometimes the thing we design can be the tool that designs the thing.”**"
  ],
  "timing": [
    "**Opening + context:** 5 min",
    "**Workflow + tools:** 7 min",
    "**Tool overview:** 4 min",
    "**Liquid.Font:** 10 min",
    "**Vinafont:** 13–15 min",
    "**Saigon 1985:** 2 min",
    "**Lessons + closing:** 6 min",
    "**Total:** around 45 min",
    "If running late, cut time from slides **08–12** first.",
    "Never rush slides **14–19**, **22–31**, or **35**."
  ]
};
