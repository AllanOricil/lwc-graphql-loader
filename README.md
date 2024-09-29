# lwc-graphql-loader

This was suppose to enable lwc developers to write their graphql queries in separate files, and then import in their js/ts file with `import`. I did not finish it, because I stopped working as a Salesforce developer. If you wish to continue, talk to me. My inspiration came from this [webpack loader](https://www.npmjs.com/package/@graphql-tools/webpack-loader).

For instance, this [example](https://developer.salesforce.com/docs/platform/lwc/guide/reference-graphql.html) from the official docs would be rewritten as:

```js
import { LightningElement, track } from 'lwc';
import myQuery from './query.graphql'

export default class MyComponent extends LightningElement {
   @wire(graphql, {
    query: myQuery,
  })
  propertyOrFunction;
}
```

While the graphql query would be in a separate file called `query.graphql`

```graphql
query AccountInfo {
        uiapi {
          query {
            Account(where: { Name: { like: "Account1" } }) {
              edges {
                node {
                  Name {
                    value
                    displayValue
                  }
                }
              }
            }
          }
        }
      }
    }
```


### why?

GraphQL queries, when integrated with JavaScript code, can be challenging to read due to a lack of syntax highlighting. Storing GraphQL queries in separate files allows for proper syntax highlighting and contributes to a reduction in verbosity in the JavaScript code.
