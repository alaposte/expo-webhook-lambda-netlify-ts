# Netlify lambda function (typesript)

### Installation

```script
yarn
```

or

```script
npm install
```

### Run in dev mode

```script
yarn dev
```

or with debug

```script
yarn debug
```

### Build

```script
yarn build
```

## How to use

https://github.com/netlify/cli/blob/master/docs/netlify-dev.md#netlify-functions

run

```script
yarn dev
```

and in a browser of your choice, open the url `http://localhost:8888/.netlify/functions/{lambda-function-name}` where `lambda` is the name of the function file in the `lambda` folder created by the `yarn dev` command

In our repo this link would be [http://localhost:8888/.netlify/functions/expo-webhook](http://localhost:8888/.netlify/functions/{lambda-function-name})
