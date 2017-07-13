# rdocs-light
Embeddable RDocumentation widget

## How to use?
Load rdocs-light.min.js in your webpage.

## How does it work?

Html elements with the `data-mini-rdoc` attribute will show a tooltip when hovered over. The value of the attribute should be of the form `package::topic`.

## Examples

You can find examples in the `example` folder in the repository.

## Building

After you downloaded this repository, run `npm install` for all the necessary dependencies.
Create a `.env` file in which you define all environment variables. See `.env.example` for all variables that need to be defined. For example, if you also run the `RDocumentation-app` local, you will have to set `API_BASE_URL` to `http://localhost:1337`.
Afterwards you can use `npm run dev` to build RDocs Light and `node web.js` to serve random examples with local build on `http://localhost:3003/`.