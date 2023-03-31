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
  ScrollView,
  Image,
  H5,
} from "@my/ui";

import {
  Play,
  Pause,
  StopCircle,
  Home,
  ArrowBigDown,
  ArrowBigUp,
  ArrowBigLeft,
  ArrowBigRight,
} from "@tamagui/lucide-icons";

import { Map } from "./map";
import React, { useEffect } from "react";
import { useLink } from "solito/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  basicControl,
  getDeviceInfo,
  getDeviceStateAttributes,
  getManualModeState,
  getMap,
  moveVaccum,
  setManualModeState,
} from "app/apicalls/apicalls";
import { useDeviceState } from "app/apicalls/apitypes";

export function HomeScreen() {
  const queryClient = useQueryClient();

  const { data, error } = useQuery(["info"], getDeviceInfo);

  const { statusState, chargingState } = useDeviceState();

  const { data: manualState, error: error2 } = useQuery(
    ["manualState"],
    getManualModeState
  );

  const { data: mapState, error: error3 } = useQuery(["map"], getMap);

  const { mutate: mutateManualState } = useMutation({
    mutationFn: setManualModeState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manualState"] });
    },
  });

  const { mutate: mutateMove } = useMutation({
    mutationFn: moveVaccum,
  });

  const { mutate: mutateBasicControl } = useMutation({
    mutationFn: basicControl,
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
    <YStack bg={"$background"} f={1} jc="center" pt="$2" space>
      {/* <YStack>
        <Paragraph>Manufacturer: {data?.manufacturer}</Paragraph>
        {/* <Paragraph>ModelDetails: {data?.modelDetails}</Paragraph>
        <Paragraph>ModelName: {data?.modelName}</Paragraph>
        <Paragraph>implementation: {data?.implementation}</Paragraph>
      </YStack> */}
      <YStack ai="center">
        <Paragraph>
          Status: {statusState.status} - {statusState.other}
        </Paragraph>
        <Paragraph>
          Charging: {chargingState.chargingState} - {chargingState.chargeLevel}%
        </Paragraph>
      </YStack>

      <Separator />

      <XStack jc="center" ai="center" space>
        <Button size="$4" onClick={() => mutateBasicControl("start")}>
          <Play />
        </Button>
        <Button size="$4" onClick={() => mutateBasicControl("pause")}>
          <Pause />
        </Button>
        <Button size="$4" onClick={() => mutateBasicControl("stop")}>
          <StopCircle />
        </Button>
        <Button size="$4" onClick={() => mutateBasicControl("home")}>
          <Home />
        </Button>
      </XStack>

      <Separator />

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
      <XStack ai="flex-end" jc="center">
        <Button
          disabled={!manualState}
          h="$4"
          onPress={() => mutateMove("rotate_counterclockwise")}
        >
          <ArrowBigLeft />
        </Button>
        <YStack>
          <Button
            disabled={!manualState}
            h="$4"
            mb="$2"
            mx="$2"
            onPress={() => mutateMove("forward")}
          >
            <ArrowBigUp />
          </Button>
          <Button
            disabled={!manualState}
            h="$4"
            mx="$2"
            onPress={() => mutateMove("backward")}
          >
            <ArrowBigDown />
          </Button>
        </YStack>
        <Button
          disabled={!manualState}
          h="$4"
          onPress={() => mutateMove("rotate_clockwise")}
        >
          <ArrowBigRight />
        </Button>
      </XStack>
      <Separator />

      {/* <Map /> */}
    </YStack>
  );
}
