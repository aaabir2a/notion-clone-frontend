import { useEffect } from 'react';
import { usePageStore } from '@/store/pageStore';

export function usePage(pageId?: string) {
  const {
    pages,
    currentPage,
    isLoading,
    error,
    fetchPages,
    fetchPage,
    createPage,
    updatePage,
    deletePage,
    duplicatePage,
    setCurrentPage,
    clearError,
  } = usePageStore();

  useEffect(() => {
    if (pageId && pageId !== currentPage?.id) {
      fetchPage(pageId);
    }
  }, [pageId]);

  return {
    pages,
    currentPage,
    isLoading,
    error,
    fetchPages,
    fetchPage,
    createPage,
    updatePage,
    deletePage,
    duplicatePage,
    setCurrentPage,
    clearError,
  };
}
