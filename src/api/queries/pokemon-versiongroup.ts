import { useQuery } from '@tanstack/react-query';
import fetcher from '../fetcher';


const VERSION_GROUP = /* GraphQL */ `
  query VersionGroup {
    pokemon_v2_versiongroup {
      id
      name
    }
  }
`;


type FetchVersionGroupResponse = {
  pokemon_v2_versiongroup: {
    id: number;
    name: string;
  }[];
};


export type QueryVersionGroupKey = ['version-group'];
export type QueryVersionGroupData = {
  groups: {
    id: number;
    name: string;
  }[];
};

export const fetchVersionGroupList = async (): Promise<QueryVersionGroupData> => {
  const res = await fetcher<FetchVersionGroupResponse>(VERSION_GROUP);
  
 
  return {
    groups: res.pokemon_v2_versiongroup,
  };
};


export const useQueryVersionGroupList = () =>
  useQuery<QueryVersionGroupData, unknown, QueryVersionGroupData, QueryVersionGroupKey>(
    ['version-group'],
    fetchVersionGroupList
  );
