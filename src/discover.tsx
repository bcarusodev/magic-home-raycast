import { Icon, List } from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import { Discovery } from "magic-home";
import { Device } from "../types/device";

export default function Command() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const discoveryRef = useRef<Discovery | null>(null);

  useEffect(() => {
    if (!discoveryRef.current) {
      discoveryRef.current = new Discovery();
      discoveryRef.current.scan(1000)
        .then((devices) => {
          setDevices(devices);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, []);

  return (
    <List isLoading={loading}>
      {devices?.map((item, index) => (
        <List.Item key={index} title={item.id} subtitle={`Model ${item.model}`} icon={Icon.Devices}/>
      ))}
    </List>
  );
}