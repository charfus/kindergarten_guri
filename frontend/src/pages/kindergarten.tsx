import React, { Fragment, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { RouteComponentProps } from "@reach/router";
import ListItem from "../component/list-item";
import DropDown from "../component/dropdown";
import SearchBar from "../component/search-bar";
import { filterByType } from "../util";
import { coordVar } from "../cache";
import ListContainer from "../component/list-container";

const GET_KINDERGARTENS = gql`
  query GetKindergartenList {
    kindergartens {
      name
      type
      tel
      location {
        long
        lat
      }
    }
  }
`;

interface KindergartenProps extends RouteComponentProps {}

const Kindergarten: React.FC<KindergartenProps> = ({ children }) => {
  const { loading: loadingAll, data: dataAll, error: errorAll } = useQuery(
    GET_KINDERGARTENS
  );
  const [type, setType] = useState<string>("");

  useEffect(() => {
    if (dataAll) {
      const filteredArray = filterByType(dataAll.kindergartens, type).map(
        (item: any) => {
          return {
            name: item.name,
            location: { long: item.location.long, lat: item.location.lat },
          };
        }
      );
      coordVar([...filteredArray]);
    }
  }, [dataAll, type]);

  if (loadingAll) return <p>Loading</p>;
  if (errorAll) return <p>ERROR</p>;
  if (!dataAll) return <p>Not found</p>;

  return (
    <>
      <h1>유치원</h1>
      <SearchBar>
        <DropDown
          name="유치원"
          list={!loadingAll && dataAll.kindergartens}
          setOption={setType}
        />
      </SearchBar>
      <ListContainer>
        {dataAll.kindergartens &&
          filterByType(
            dataAll.kindergartens,
            type
          ).map((kg: any, i: number) => (
            <ListItem item={kg} key={`list-${i}`} />
          ))}
      </ListContainer>
      {children}
    </>
  );
};

export default Kindergarten;
