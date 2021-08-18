import React from "react";
import styled from "styled-components";
import {
  Loading,
  ModalSection,
  Error,
  Success,
  List as ListStyles,
  Item as ItemStyles,
} from "../Shared";
import { useGetAllPlaylists, usePostPlaylistItems } from "../../queries/hooks";
import { useGlobalContext } from "../../state/context";
import { Collection } from "../../types/types";
import { AddPlaylistForm } from "../AddPlaylistForm";
import { FaPlus } from "react-icons/fa";

const List = styled(ListStyles)`
  padding-top: 0;
`;

const Item: React.FC<{ data: Collection }> = ({ data }) => {
  const { state } = useGlobalContext();
  const mutation = usePostPlaylistItems();

  const handleAddPlaylistItem = async (collection: Collection) => {
    if (state.ui.currentTrack) {
      const payload = {
        id: collection.playlistInfo.id,
        tracks: [state.ui.currentTrack],
      };

      mutation
        .mutateAsync(payload)
        .then((data) => console.log("success!", data));
    }
  };

  return (
    <ItemStyles>
      {data.playlistInfo.name}
      {mutation.isLoading && <Loading style={{ width: "40px" }} />}
      {mutation.isError && <Error />}
      {!mutation.isLoading && !mutation.isError && !mutation.isSuccess && (
        <FetchButton onClick={() => handleAddPlaylistItem(data)}>
          ADD
        </FetchButton>
      )}
      {mutation.isSuccess && <Success />}
    </ItemStyles>
  );
};

const FetchButton = styled.button`
  visibility: hidden;
  background: none;
  border: none;
  color: var(--accent) !important;
  opacity: 1 !important;

  &:hover {
    cursor: pointer;
  }
`;

export const AddItemModal = (): JSX.Element => {
  const { state } = useGlobalContext();
  const { data, isLoading } = useGetAllPlaylists();

  if (isLoading) return <Loading />;

  return (
    <ModalSection
      title={
        <span>
          Select a playlist to add <em>{state.ui.currentTrack?.name}</em>
        </span>
      }
    >
      {data && data.length > 0 ? (
        <List>
          <AddPlaylistForm>
            <span style={{ marginRight: "8px" }}>Create new </span>
            <FaPlus />
          </AddPlaylistForm>
          {data.map((playlist, index) => (
            <Item data={playlist} key={index} />
          ))}
        </List>
      ) : (
        <p style={{ padding: "2px 24px" }}>
          You don&apos;t have any spotify playlists to import
        </p>
      )}
      <button>Close</button>
    </ModalSection>
  );
};
