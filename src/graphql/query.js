import gql from 'graphql-tag';

export const GET_RESTAURANTS = gql`
  query search($term: String!, $latitude: Float!, $longitude: Float!) {
    search(term: $term, latitude: $latitude, longitude: $longitude, limit: 10) {
        total
        business {
            id
            name
            url
            hours {
              is_open_now
              open {
                start
                end
              }
            }
            review_count
            rating
            location {
              formatted_address
            }
            photos
            categories {
              title
              alias
            }
            coordinates{
              latitude
              longitude
            }
        }
    }
  }
`;
