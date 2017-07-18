# rdocs-light
Embeddable RDocumentation widget

## How does it work?

Html elements with the `data-mini-rdoc` attribute will show a tooltip with information when hovered over. The value of the attribute should be of the form `package::topic` or just `package`.

## How to use?
- Load rdocs-light.min.js in your webpage.
- Call `rdl.initRDocsLight();` on page load

### Auto Link to RDocumentation
- Tags with the `data-mini-rdoc` attribute can be automatically changed to link to the documentation.
- Can also be used standzlone (without initiating RDocsLight)
- Call `rdl.autoLink();`

### Options
#### Auto Pinning 
- Whether or not the widget is pinned automatically.
- Defaults to `false`
- Can be set with `rdl.setAutoPinning(val);`

#### Pin on click
- Whether or not the widget is pinned when the user clicks on the widget.
- Defaults to `true`
- Can be set with `rdl.setPinOnClick(val);`

#### Show Widget also for Rdoc Links
- Whether or not widgets are shown for links to rdocumentation.org
- No need for the attribute, just the link 
- Defaults to `false`
- Can be set with `rdl.setWidgetsForRdocLinks(val);`
- Example links
  - https://rdocumentation.org/packages/dplyr/versions/0.7.1
  - https://rdocumentation.org/packages/dplyr/versions/0.7.1/topics/arrange
  - https://rdocumentation.org/packages/dplyr/
  - https://rdocumentation.org/packages/dplyr/topics/arrange 

## Examples

You can find examples in the `example` folder in the repository.

## Building

- After you downloaded this repository, run `npm install` for all the necessary dependencies.
- Create a `.env` file in which you define all environment variables. See `.env.example` for all variables that need to be defined. For example, if you also run the `RDocumentation-app` local, you will have to set `API_BASE_URL` to `http://localhost:1337`.
- Afterwards you can use `npm run dev` to build RDocs Light and `node web.js` to serve random examples with local build on `http://localhost:3003/`.
