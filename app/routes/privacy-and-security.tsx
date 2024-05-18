import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Code,
  Container,
  Group,
  List,
  Text,
  Title,
} from "@mantine/core";
import { type MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { IconBrandGithub } from "@tabler/icons-react";
import AdamRMSLogoIcon from "~/components/AdamRMS/logoicon.svg";
export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Privacy and Security | Bithell Studios Telemetry and Analytics Platform",
    },
  ];
};

export default function Index() {
  return (
    <Container mt={"lg"}>
      <Title order={1}>Privacy and Security</Title>
      <Text mb={"sm"}>
        The platform runs on Cloudflare Workers, is open source and operates
        under the following privacy principles:
      </Text>
      <List>
        <List.Item>No personal data is stored or collected</List.Item>
        <List.Item>
          All data stored is shown transparently in the source code
        </List.Item>
        <List.Item>Data is presented as-is, without processing</List.Item>
      </List>
      <Text mt={"lg"} mb={"sm"}>
        You can read the entire source code of the platform at any time on{" "}
        <Link to="https://github.com/bstudios/telemetry-and-analytics">
          <Button
            rightSection={<IconBrandGithub />}
            variant="default"
            color="gray"
            size="compact-md"
          >
            Github
          </Button>
        </Link>{" "}
        including the deployment pipeline which is used to deploy the platform
        to Cloudflare.
      </Text>
      <Title order={2} mb="md">
        Data collected by application
      </Title>
      <Accordion chevronPosition="right" variant="contained">
        <Accordion.Item value="adamrms">
          <Accordion.Control>
            <Group wrap="nowrap">
              <Avatar size="lg" src={AdamRMSLogoIcon} alt="AdamRMS Logo" />
              <div>
                <Text>AdamRMS</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  AdamRMS is a free, open source advanced Rental Management
                  System for Theatre, AV & Broadcast
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              As of version{" "}
              <Link to="https://github.com/adam-rms/adam-rms/releases/tag/v1.200.0">
                <Code>v1.200</Code>
              </Link>{" "}
              sending telemetry data is not optional, but users can opt-out of
              enhanced telemetry collection.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
