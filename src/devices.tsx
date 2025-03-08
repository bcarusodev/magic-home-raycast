import { ActionPanel, Icon, List, LocalStorage, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { Device } from "../types/device";
import { Control } from "magic-home";
import Style = Toast.Style;

async function loadAllFromStorage() {
  const devices = await LocalStorage.allItems();
  return Object.keys(devices).filter(key => !key.includes('default-device')).map((key) => JSON.parse(devices[key]));
}

async function handleDevicePower(deviceControl: Control, power: boolean) {
  await deviceControl.setPower(power);
  await showToast({ title: `The device has been turned ${power ? 'on' : 'off'}`, style: Style.Success });
}

async function setDefaultDevice(address: string) {
  await LocalStorage.setItem("default-device", address);
  await showToast({ title: "Device set up as default device", message: 'Now you can control it through the direct extension commands', style: Style.Success });
}

function Actions(props: { item: Device }) {
  const deviceControl = new Control(props.item.address);
  return (
    <ActionPanel title={props.item.model}>
      <ActionPanel.Section>
        <ActionPanel.Item title={"Power On"} onAction={() => handleDevicePower(deviceControl, true)}></ActionPanel.Item>
        <ActionPanel.Item
          title={"Power Off"}
          onAction={() => handleDevicePower(deviceControl, false)}
        ></ActionPanel.Item>
        <ActionPanel.Item
          title={"Set as default device"}
          onAction={() => setDefaultDevice(props.item.address)}
        ></ActionPanel.Item>
      </ActionPanel.Section>
    </ActionPanel>
  );
}

export default function Command() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAllFromStorage().then((dvs) => {
      setDevices(dvs);
      setLoading(false);
    });
  }, []);

  return (
    <List isLoading={loading}>
      {devices?.map((item, index) => (
        <List.Item
          key={index}
          title={item.id}
          subtitle={`Model ${item.model}`}
          icon={Icon.Devices}
          actions={<Actions item={item} />}
        />
      ))}
    </List>
  );
}