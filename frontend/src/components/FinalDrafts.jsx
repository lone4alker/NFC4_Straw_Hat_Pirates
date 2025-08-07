import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Trash2, Copy, Check } from 'lucide-react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from './firebase'; // Assuming you have a firebase.js file for initialization

export default function FinalDrafts({ handleOpenScheduleModal }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedDraftId, setCopiedDraftId] = useState(null);
  const [deletingDraftId, setDeletingDraftId] = useState(null);
  
  const auth = getAuth(app);
  const user = auth.currentUser;

  useEffect(() => {
    // If no user is logged in, stop loading and return
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getDatabase(app);
    // Reference to the user-specific drafts in the Realtime Database
    const draftsRef = ref(db, `drafts/${user.uid}`);

    // Set up a real-time listener for the user's drafts
    const unsubscribe = onValue(draftsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedDrafts = [];
      
      if (data) {
        // Iterate through the data to populate the drafts array
        for (const id in data) {
          if (data.hasOwnProperty(id)) {
            loadedDrafts.push({
              id: id,
              ...data[id],
              // Convert timestamp string back to Date object for proper sorting
              timestamp: new Date(data[id].timestamp), 
            });
          }
        }
        // Sort drafts by timestamp, newest first
        loadedDrafts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }
      
      setDrafts(loadedDrafts);
      setLoading(false); // Set loading to false once data is fetched
    }, (error) => {
      // Log any errors during data fetching
      console.error('Error fetching drafts:', error);
      setLoading(false); // Also stop loading on error
    });

    // Clean up the listener when the component unmounts to prevent memory leaks
    return () => unsubscribe();
  }, [user]); // Re-run effect if the user object changes

  // Function to delete a draft from the database
  const handleDeleteDraft = async (draftId) => {
    if (!user) return; // Ensure user is logged in before attempting to delete
    
    try {
      setDeletingDraftId(draftId); // Set loading state for the specific draft being deleted
      const db = getDatabase(app);
      const draftRef = ref(db, `drafts/${user.uid}/${draftId}`);
      await remove(draftRef); // Remove the draft from the database
      console.log('Draft deleted successfully');
    } catch (error) {
      console.error('Error deleting draft:', error);
    } finally {
      setDeletingDraftId(null); // Reset deleting state regardless of success or failure
    }
  };

  // Function to copy draft content to clipboard
  const handleCopyDraft = async (content, draftId) => {
    try {
      await navigator.clipboard.writeText(content); // Use modern Clipboard API
      setCopiedDraftId(draftId); // Show "Copied!" feedback
      setTimeout(() => setCopiedDraftId(null), 2000); // Hide feedback after 2 seconds
    } catch (err) {
      // Fallback for older browsers or environments where Clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy'); // Deprecated but widely supported fallback
      document.body.removeChild(textArea);
      setCopiedDraftId(draftId); // Show "Copied!" feedback
      setTimeout(() => setCopiedDraftId(null), 2000); // Hide feedback after 2 seconds
    }
  };

  // Helper function to format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Conditional rendering for when the user is not logged in
  if (!user) {
    return (
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Please log in to view your drafts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Final Drafts</h2>
        
        {loading ? (
          // Loading spinner and message
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading drafts...</p>
          </div>
        ) : drafts.length === 0 ? (
          // Message when no drafts are available
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No drafts yet</p>
            <p className="text-gray-400 text-sm">Messages you move to drafts will appear here</p>
          </div>
        ) : (
          // Display drafts if available
          <>
            <div className="mb-4 text-sm text-gray-600">
              {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved
            </div>
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">
                        Added on {formatDate(draft.timestamp)} at {formatTime(draft.timestamp)}
                      </span>
                      {/* Removed "From Chat" tag */}
                    </div>
                    <div className="flex gap-2">
                      {/* Copy button */}
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
                      {/* Schedule button */}
                      <button
                        onClick={() => handleOpenScheduleModal(draft)}
                        className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50"
                        title="Schedule this draft"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        disabled={deletingDraftId === draft.id} // Disable while deleting
                        className="text-red-500 hover:text-red-600 text-sm transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                        title="Delete this draft"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingDraftId === draft.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Image display if available */}
                  {draft.imageUrl && (
                    <img
                      src={draft.imageUrl}
                      alt="Draft content"
                      className="max-w-full h-auto rounded-lg mb-4 border border-gray-200"
                    />
                  )}
                  
                  {/* Draft content */}
                  <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {draft.content}
                  </div>
                  
                  {/* Removed Type and ID metadata */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-end text-xs text-gray-500">
                    {draft.hasImage && <span className="mr-4">📎 Has image</span>}
                    <div>
                      ID: {draft.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}