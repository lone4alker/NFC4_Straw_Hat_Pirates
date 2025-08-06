import React, { useState, useEffect } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { getDatabase, ref, onValue, push, remove, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from './firebase'; // Assuming you have a firebase.js file for initialization

export default function FinalDrafts({ handleOpenScheduleModal }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getDatabase(app);
    const draftsRef = ref(db, `drafts/${user.uid}`);

    // Set up a real-time listener for the user's drafts
    const unsubscribe = onValue(draftsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedDrafts = [];
      for (const id in data) {
        if (data.hasOwnProperty(id)) {
          loadedDrafts.push({
            id: id,
            ...data[id],
            timestamp: new Date(data[id].timestamp),
          });
        }
      }
      setDrafts(loadedDrafts);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [user]);

  // Function to delete a draft from the database
  const handleDeleteDraft = (draftId) => {
    const db = getDatabase(app);
    const draftRef = ref(db, `drafts/${user.uid}/${draftId}`);
    remove(draftRef);
  };

  // The rest of your component's JSX
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Final Drafts</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading drafts...</p>
      ) : drafts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No drafts yet</p>
          <p className="text-gray-400 text-sm">Messages you move to drafts will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-gray-500">
                  Added {draft.timestamp.toLocaleDateString()} at {draft.timestamp.toLocaleTimeString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenScheduleModal(draft)}
                    className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors flex items-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="text-red-500 hover:text-red-600 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {draft.imageUrl && (
                <img
                  src={draft.imageUrl}
                  alt="Draft content"
                  className="max-w-full h-auto rounded-lg mb-4"
                />
              )}
              <div className="text-gray-900 whitespace-pre-wrap">{draft.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}