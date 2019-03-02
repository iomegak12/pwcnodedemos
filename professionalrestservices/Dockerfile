FROM mhart/alpine-node

COPY . /app

WORKDIR /app

EXPOSE 9090

ENTRYPOINT [ "./node_modules/.bin/babel-node index-single.js" ]