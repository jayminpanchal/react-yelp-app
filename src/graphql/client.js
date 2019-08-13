import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {ApolloLink, concat} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';

const httpLink = createHttpLink({
    uri: 'https://api.yelp.com/v3/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
        headers: {
            authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`,
            'Accept-Language': 'en_US'
        }
    });

    return forward(operation);
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authMiddleware, httpLink)
});

export default client;