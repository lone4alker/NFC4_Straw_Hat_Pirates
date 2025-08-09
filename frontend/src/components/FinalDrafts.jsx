import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Trash2, Copy, Check } from 'lucide-react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from './firebase'; // Ensure Firebase is correctly initialized here

export default function FinalDrafts({ handleOpenScheduleModal }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedDraftId, setCopiedDraftId] = useState(null);
  const [deletingDraftId, setDeletingDraftId] = useState(null);

  const auth = getAuth(app);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getDatabase(app);
    const draftsRef = ref(db, `drafts/${user.uid}`);

    const unsubscribe = onValue(
      draftsRef,
      (snapshot) => {
        const data = snapshot.val();
        const loadedDrafts = [];

        if (data) {
          for (const id in data) {
            if (data.hasOwnProperty(id)) {
              loadedDrafts.push({
                id: id,
                ...data[id],
                timestamp: new Date(data[id].timestamp),
              });
            }
          }
          loadedDrafts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        }

        setDrafts(loadedDrafts);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching drafts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDeleteDraft = async (draftId) => {
    if (!user) return;

    try {
      setDeletingDraftId(draftId);
      const db = getDatabase(app);
      const draftRef = ref(db, `drafts/${user.uid}/${draftId}`);
      await remove(draftRef);
      console.log('Draft deleted successfully');
    } catch (error) {
      console.error('Error deleting draft:', error);
    } finally {
      setDeletingDraftId(null);
    }
  };

  const handleCopyDraft = async (content, draftId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedDraftId(draftId);
      setTimeout(() => setCopiedDraftId(null), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedDraftId(draftId);
      setTimeout(() => setCopiedDraftId(null), 2000);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Please log in to view your drafts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Main content scrollable */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Final Drafts</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading drafts...</p>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No drafts yet</p>
              <p className="text-gray-400 text-sm">Messages you move to drafts will appear here</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved
              </div>
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">
                          Added on {formatDate(draft.timestamp)} at {formatTime(draft.timestamp)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {/* Copy */}
                        <button
                          onClick={() => handleCopyDraft(draft.content, draft.id)}
                          className="text-gray-500 hover:text-emerald-600 text-sm transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50"
                          title="Copy to clipboard"
                        >
                          {copiedDraftId === draft.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>

                        {/* Schedule */}
                        <button
                          onClick={() => handleOpenScheduleModal(draft)}
                          className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50"
                          title="Schedule this draft"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          disabled={deletingDraftId === draft.id}
                          className="text-red-500 hover:text-red-600 text-sm transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                          title="Delete this draft"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingDraftId === draft.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>

                    {/* Image if exists */}
                    {draft.imageUrl && (
                      <img
                        src={draft.imageUrl}
                        alt="Draft"
                        className="max-w-full h-auto rounded-lg mb-4 border border-gray-200"
                      />
                    )}

                    {/* Content */}
                    <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {draft.content}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-end text-xs text-gray-500">
                      {draft.hasImage && <span className="mr-4">📎 Has image</span>}
                      <div>ID: {draft.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
