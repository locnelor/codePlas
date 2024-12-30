import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
export const APOLLO_BASE_URL = import.meta.env.VITE_APOLLO_BASE_URL

const makeClient = () => {
  const AuthLink = setContext((_, { headers }) => {
    const token =window.localStorage.getItem('token')

    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }
  })
  return new ApolloClient({
    link: AuthLink.concat(
      new HttpLink({
        uri: APOLLO_BASE_URL
      })
    ),
    cache: new InMemoryCache(),
  })
}
export default makeClient