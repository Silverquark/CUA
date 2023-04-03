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
  Dialog,
  Adapt,
  H2,
  Input,
  Label,
  Sheet,
  TooltipSimple,
  Unspaced,
  Fieldset,
  ListItem,
  YGroup,
} from "@my/ui";

import { useState } from "react";

import { ChevronRight, Star, X } from "@tamagui/lucide-icons";

import { useAtom } from "jotai/react";
import { robotsAtom } from "../../jotai";

import { useRouter } from "expo-router";

export function DialogDemo() {
  const router = useRouter();

  const [robots, setRobots] = useAtom(robotsAtom);
  const [ip, setIp] = useState("");

  const onRemove = (ip: string) => {
    console.log(ip);

    setRobots(robots.filter((x) => x.ip !== ip));
  };

  const onAdd = (ip: string) => {
    console.log(ip);
    setRobots([
      ...robots,
      {
        ip: ip,
      },
    ]);
    console.log({ robots });
  };

  return (
    <Dialog modal>
      <YGroup m={"$4"} bordered size="$6" separator={<Separator />}>
        {robots.map((robot) => {
          return (
            <YGroup.Item key={robot.ip}>
              {/* <Button ml={"$4"} onPress={() => onRemove(robot.ip)} icon={X} /> */}

              <ListItem
                hoverTheme
                pressTheme
                title="Hallo"
                icon={Star}
                onPress={() => router.push(`/robot/${robot.ip}`)}
                //                onRemove(robot.ip)}
                subTitle={robot.ip}
                iconAfter={ChevronRight}
              />
            </YGroup.Item>
          );
        })}
      </YGroup>
      <Separator my="$4" />

      <Dialog.Trigger asChild>
        <Button>Add Robot</Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          space
        >
          <Dialog.Title>Add new Robot</Dialog.Title>
          <Dialog.Description>Enter the ip of your robot.</Dialog.Description>
          <Fieldset space="$4" horizontal>
            <Label w={160} justifyContent="flex-end" htmlFor="ip">
              IP
            </Label>
            <Input
              value={ip}
              onChangeText={(text) => setIp(text)}
              f={1}
              id="ip"
              defaultValue="192.168.178.28"
            />
          </Fieldset>

          <YStack ai="flex-end" mt="$2">
            <Dialog.Close displayWhenAdapted asChild>
              <Button onPress={() => onAdd(ip)} theme="alt1" aria-label="Close">
                Add
              </Button>
            </Dialog.Close>
          </YStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                pos="absolute"
                t="$3"
                r="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
