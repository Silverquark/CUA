import {
  Anchor,
  Button,
  H1,
  H3,
  Paragraph,
  Separator,
  XStack,
  YStack,
  Switch,
  Image,
  H5,
} from "@my/ui";
import React, { useEffect } from "react";
import { useLink } from "solito/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type deviceInfo = {
  manufacturer: string;
  modelName: string;
  modelDetails: {
    supportedAttachments: ["dustbin"];
  };
  implementation: string;
};

const fetchUsers = async () => {
  const res = await fetch("http://192.168.178.28/api/v2/robot");
  return (await res.json()) as deviceInfo;
};

const fetchManualState = async () => {
  const res = await fetch(
    "http://192.168.178.28/api/v2/robot/capabilities/ManualControlCapability"
  );
  return (await res.json()).enabled as boolean;
};

const setManualMode = async (enable: boolean) => {
  return await axios.put(
    "http://192.168.178.28/api/v2/robot/capabilities/ManualControlCapability",
    {
      action: enable ? "enable" : "disable",
    }
  );
};

const move = async (
  action:
    | "forward"
    | "backward"
    | "rotate_counterclockwise"
    | "rotate_clockwise"
) => {
  return await axios.put(
    "http://192.168.178.28/api/v2/robot/capabilities/ManualControlCapability",
    {
      action: "move",
      movementCommand: action,
    }
  );
};

export function HomeScreen() {
  const queryClient = useQueryClient();

  const { data, error } = useQuery(["info"], fetchUsers);

  const { data: manualState, error: error2 } = useQuery(
    ["manualState"],
    fetchManualState
  );

  const { mutate: mutateManualState } = useMutation({
    mutationFn: setManualMode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manualState"] });
    },
  });

  const { mutate: mutateMove } = useMutation({
    mutationFn: move,
  });

  /* 
  if (isLoading) {
    return <Paragraph>Loading...</Paragraph>
  } */

  if (error) {
    return <Paragraph>{error}</Paragraph>;
  }
  if (!data) {
    return <Paragraph>Help there is no data</Paragraph>;
  }

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack>
        <Paragraph>Manufacturer: {data?.manufacturer}</Paragraph>
        {/* <Paragraph>ModelDetails: {data?.modelDetails}</Paragraph> */}
        <Paragraph>ModelName: {data?.modelName}</Paragraph>
        <Paragraph>implementation: {data?.implementation}</Paragraph>
      </YStack>

      <XStack jc="center" ai="center" space>
        <H5>Manual Mode:</H5>
        <Switch
          size="$4"
          checked={manualState}
          onCheckedChange={() => mutateManualState(!manualState)}
        >
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>

      <XStack ai="flex-end">
        <Button
          disabled={!manualState}
          h="$4"
          onPress={() => mutateMove("rotate_counterclockwise")}
        >
          Left
        </Button>
        <YStack>
          <Button
            disabled={!manualState}
            h="$4"
            onPress={() => mutateMove("forward")}
          >
            Up
          </Button>
          <Button
            disabled={!manualState}
            h="$4"
            onPress={() => mutateMove("backward")}
          >
            Down
          </Button>
        </YStack>
        <Button
          disabled={!manualState}
          h="$4"
          onPress={() => mutateMove("rotate_clockwise")}
        >
          Right
        </Button>
      </XStack>
    </YStack>
  );
}
