import React, { useState, useEffect } from "react";
import { Host } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HostFormProps {
  initialData?: Host | null;
  onSave: (host: Host) => void;
  onCancel: () => void;
}

const HostForm: React.FC<HostFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Host>({
    id: crypto.randomUUID(),
    label: "",
    hostname: "",
    port: 22,
    username: "",
    authType: "password",
    password: "",
    keyPath: "",
    group: "Default",
    tags: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "port" ? parseInt(value) || 22 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Host" : "New Host"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Label
            </label>
            <Input
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="My Web Server"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Hostname / IP
              </label>
              <Input
                name="hostname"
                value={formData.hostname}
                onChange={handleChange}
                placeholder="192.168.1.1"
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Port
              </label>
              <Input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Username
            </label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="root"
              className="font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Auth Type
            </label>
            <Tabs
              value={formData.authType}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, authType: v as Host["authType"] }))
              }
            >
              <TabsList className="w-full">
                <TabsTrigger value="password" className="flex-1">
                  Password
                </TabsTrigger>
                <TabsTrigger value="key" className="flex-1">
                  Key
                </TabsTrigger>
                <TabsTrigger value="agent" className="flex-1">
                  Agent
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {formData.authType === "password" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="font-mono"
              />
            </div>
          )}

          {formData.authType === "key" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Private Key Path
              </label>
              <Input
                name="keyPath"
                value={formData.keyPath || ""}
                onChange={handleChange}
                placeholder="~/.ssh/id_rsa"
                className="font-mono"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Host
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HostForm;
