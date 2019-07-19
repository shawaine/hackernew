import React, { useState } from "react";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

function Search(props) {
  const [search, setSearch] = useState({
    links: [],
    filter: ""
  });

  const executeSearch = async () => {
    const { filter } = search;
    const result = await props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });
    const links = result.data.feed.links;
    setSearch({ ...search, links });
  };

  return (
    <div>
      <div>
        Search
        <input
          type="text"
          onChange={e => setSearch({ ...search, filter: e.target.value })}
        />
        <button onClick={() => executeSearch()}>OK</button>
      </div>
      {search.links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
}

export default withApollo(Search);
