# rdocs-light
Embeddable RDocumentation widget

## How does it work?

Html elements with the `data-mini-rdoc` attribute will show a tooltip with information when hovered over. The value of the attribute should be of the form `package::topic` or just `package`. The version of the package can also be defined with the optional `data-mini-rdoc-version` attribute. 

If the version attribute is not provided:
- For a package the documentation for the latest version of that package will be shown.
- For a topic the documentation for the topic in the latest version of the package (which contains the topic) will be shown.

## How to use?
- Load rdocs-light.min.js in your webpage.
- Call `rdl.initRDocsLight();` on page load
- By default, the library searches through the whole body, if you want to change this, you can pass a DOM element to the call above.

### Auto Link to RDocumentation
- Tags with the `data-mini-rdoc` attribute can be automatically changed to link to the documentation.
- Can also be used standalone (without initiating RDocsLight)
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

#### Set top offset
- If there is a fixed element positioned at the top of the scrollable element, you can set the offset
- Defaults to `0`
- Can be set with `rdl.setTopOffset(val);`

## Examples

You can find examples in the `example` folder in the repository.

## Building

- After you downloaded this repository, run `npm install` for all the necessary dependencies.
- Create a `.env` file in which you define all environment variables. See `.env.example` for all variables that need to be defined. For example, if you also run the `RDocumentation-app` local, you will have to set `API_BASE_URL` to `http://localhost:1337`.
- Afterwards you can use `npm run dev` to build RDocs Light and `node web.js` to serve random examples with local build on `http://localhost:3003/`.
