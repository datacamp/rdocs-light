# rdocs-light
Embeddable RDocumentation widget

## How does it work?

Html elements with the `data-mini-rdoc` attribute will show a tooltip when hovered over. The value of the attribute should be of the form `package::topic` or just `package`.

## How to use?
- Load rdocs-light.min.js in your webpage.
- Call `rdl.initRDocsLight();` on page load

### Options
#### Auto Pinning 
Whether or not the widget is pinned automatically.
Defaults to `false`
Can be set with `rdl.setAutoPinning(val);`

#### Pin on click
Whether or not the widget is pinned when the user clicks on the widget.
Defaults to `true`
Can be set with `rdl.setPinOnClick(val);`

## Examples

You can find examples in the `example` folder in the repository.

## Building

After you downloaded this repository, run `npm install` for all the necessary dependencies.
Create a `.env` file in which you define all environment variables. See `.env.example` for all variables that need to be defined. For example, if you also run the `RDocumentation-app` local, you will have to set `API_BASE_URL` to `http://localhost:1337`.
Afterwards you can use `npm run dev` to build RDocs Light and `node web.js` to serve random examples with local build on `http://localhost:3003/`.
