import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getHosts,
  saveHosts,
  getSettings,
  saveSettings,
  getTabState,
  saveTabState,
  clearTabState,
} from "@/utils/storage";
import { Host } from "@/types";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Storage Utils", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("Hosts", () => {
    it("should return empty array when no hosts exist", () => {
      const hosts = getHosts();
      expect(hosts).toEqual([]);
    });

    it("should save and retrieve hosts", () => {
      const testHost: Host = {
        id: "test-1",
        label: "Test Server",
        hostname: "192.168.1.1",
        port: 22,
        username: "root",
        authType: "password",
      };

      saveHosts([testHost]);
      const hosts = getHosts();

      expect(hosts).toHaveLength(1);
      expect(hosts[0].label).toBe("Test Server");
    });
  });

  describe("Settings", () => {
    it("should return default settings when none exist", () => {
      const settings = getSettings();

      expect(settings.theme).toBe("default");
      expect(settings.fontSize).toBe(14);
      expect(settings.cursorStyle).toBe("block");
    });

    it("should save and retrieve settings", () => {
      saveSettings({ theme: "dracula", fontSize: 16 });
      const settings = getSettings();

      expect(settings.theme).toBe("dracula");
      expect(settings.fontSize).toBe(16);
    });
  });

  describe("Tab State", () => {
    it("should return null when no tab state exists", () => {
      const state = getTabState();
      expect(state).toBeNull();
    });

    it("should save and retrieve tab state", () => {
      const testState = {
        tabs: [
          {
            id: "tab-1",
            title: "Terminal",
            layout: { type: "terminal" as const, sessionId: "session-1" },
            activeSessionId: "session-1",
          },
        ],
        activeTabId: "tab-1",
        sessions: [],
      };

      saveTabState(testState);
      const state = getTabState();

      expect(state).not.toBeNull();
      expect(state?.tabs).toHaveLength(1);
      expect(state?.activeTabId).toBe("tab-1");
    });

    it("should clear tab state", () => {
      saveTabState({
        tabs: [],
        activeTabId: "",
        sessions: [],
      });

      clearTabState();
      const state = getTabState();

      expect(state).toBeNull();
    });
  });
});
