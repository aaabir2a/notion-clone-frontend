import { create } from "zustand";
import { pageApi } from "@/lib/api/page";
import type { Page } from "@/types";

interface PageState {
  pages: Page[];
  currentPage: Page | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPages: (workspaceId: string) => Promise<void>;
  fetchPage: (id: string) => Promise<void>;
  createPage: (data: {
    title: string;
    workspaceId: string;
    parentId?: string;
    icon?: string;
  }) => Promise<Page>;
  updatePage: (id: string, data: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  duplicatePage: (id: string) => Promise<void>;
  setCurrentPage: (page: Page | null) => void;
  clearError: () => void;
}

export const usePageStore = create<PageState>((set, get) => ({
  pages: [],
  currentPage: null,
  isLoading: false,
  error: null,

  fetchPages: async (workspaceId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await pageApi.getPages(workspaceId);
      set({ pages: response.data?.pages || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch pages",
        isLoading: false,
      });
    }
  },

  fetchPage: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await pageApi.getPage(id);
      const page = response.data?.page;

      // Ensure we have the complete page data
      if (page) {
        console.log("Fetched page:", page); // Debug log
        set({ currentPage: page, isLoading: false });
      } else {
        throw new Error("Page data is incomplete");
      }
    } catch (error: any) {
      console.error("Error fetching page:", error); // Debug log
      set({
        error: error.response?.data?.message || "Failed to fetch page",
        isLoading: false,
        currentPage: null,
      });
    }
  },

  createPage: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await pageApi.createPage(data);
      const newPage = response.data?.page;

      if (newPage) {
        set((state) => ({
          pages: [...state.pages, newPage],
          isLoading: false,
        }));
      }

      return newPage!;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create page",
        isLoading: false,
      });
      throw error;
    }
  },

  updatePage: async (id, data) => {
    try {
      const response = await pageApi.updatePage(id, data);
      const updated = response.data?.page;

      set((state) => ({
        pages: state.pages.map((p) => (p.id === id ? updated! : p)),
        currentPage:
          state.currentPage?.id === id
            ? { ...state.currentPage, ...updated }
            : state.currentPage,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update page" });
      throw error;
    }
  },

  deletePage: async (id) => {
    try {
      await pageApi.deletePage(id);
      set((state) => ({
        pages: state.pages.filter((p) => p.id !== id),
        currentPage: state.currentPage?.id === id ? null : state.currentPage,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete page" });
      throw error;
    }
  },

  duplicatePage: async (id) => {
    try {
      const response = await pageApi.duplicatePage(id);
      const duplicated = response.data?.page;

      if (duplicated) {
        set((state) => ({
          pages: [...state.pages, duplicated],
        }));
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to duplicate page",
      });
      throw error;
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  clearError: () => set({ error: null }),
}));
