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

Compose graphql queries using separate files using `#import './userFragment.gql'` (dry)

Someone could later create a VSCode Extension to run these graphql queries using .graphql | .gql ( or even .sfgraphql | .sfgql in case sf has a propriety graphql syntax) 



### Additional info

I remember I was pretty close to finishing this, and then I had a problem with the `gql` tag template literal that is used in lwc. It did not behave as the one used by other vendors.

https://github.com/salesforce/lwc/issues/3615

