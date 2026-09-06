FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8778 DATA_DIR=/app/.data
COPY --chown=node:node package.json server.mjs vibecoding-deck.html ./
COPY --chown=node:node public ./public
RUN mkdir -p /app/.data && chown node:node /app/.data
USER node
EXPOSE 8778
CMD ["node", "server.mjs"]
