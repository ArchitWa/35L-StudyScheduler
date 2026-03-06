import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteStudyGroup, fetchGroupDetails, fetchGroupRequests, getUser, leaveStudyGroup, updateMembershipRequestStatus } from '../lib/api';

import Navbar from '../components/navbar';
import { ClassPill, EditGroupModal, Avatar } from '../components';
import { formatTime, normalizeClasses } from '../lib/helpers';


const REQUEST_EXIT_ANIMATION_MS = 450;

function isLikelyUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

const GroupViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [groupRequests, setGroupRequests] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [requestActionError, setRequestActionError] = useState('');
  const [acceptingRequestIds, setAcceptingRequestIds] = useState([]);
  const [decliningRequestIds, setDecliningRequestIds] = useState([]);
  const [requestExitStates, setRequestExitStates] = useState({});
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');
  const [groupActionLoading, setGroupActionLoading] = useState('');
  const [groupActionError, setGroupActionError] = useState('');
  const [error, setError] = useState(null);
  const requestExitTimeoutIdsRef = useRef([]);


  useEffect(() => {
    const getGroupDetails = async () => {
      try {
        const [data, userId] = await Promise.all([fetchGroupDetails(id), getUser()]);
        setGroupData(data.group);
        setCurrentUserId(userId);

        const isOwner = String(userId) === String(data?.group?.group_owner);

        if (isOwner) {
          const pendingRequests = await fetchGroupRequests(id);
          setGroupRequests(Array.isArray(pendingRequests) ? pendingRequests.filter((request) => request.status === 'pending') : []);
        } else {
          setGroupRequests([]);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    getGroupDetails();
  }, [id]);

  useEffect(() => {
    return () => {
      requestExitTimeoutIdsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      requestExitTimeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const previousBodyOverscrollY = document.body.style.overscrollBehaviorY;
    const previousHtmlOverscrollY = document.documentElement.style.overscrollBehaviorY;

    document.body.style.overscrollBehaviorY = 'none';
    document.documentElement.style.overscrollBehaviorY = 'none';

    return () => {
      document.body.style.overscrollBehaviorY = previousBodyOverscrollY;
      document.documentElement.style.overscrollBehaviorY = previousHtmlOverscrollY;
    };
  }, []);


  const classList = useMemo(() => normalizeClasses(groupData?.classes), [groupData]);
  const users = useMemo(
    () => (Array.isArray(groupData?.users) ? groupData.users.filter(Boolean) : []),
    [groupData]
  );
  const pendingRequests = useMemo(
    () => (Array.isArray(groupRequests) ? groupRequests.filter((request) => request?.status === 'pending') : []),
    [groupRequests]
  );
  const isCurrentUserMember = useMemo(
    () => users.some((user) => String(user?.id) === String(currentUserId)),
    [users, currentUserId]
  );
  const isOwner = useMemo(
    () => String(currentUserId) === String(groupData?.group_owner),
    [currentUserId, groupData?.group_owner]
  );

  const animateAndRemoveRequest = (requestId, actionType) => {
    setRequestExitStates((prev) => ({ ...prev, [requestId]: actionType }));

    const timeoutId = window.setTimeout(() => {
      setGroupRequests((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.filter((request) => request.id !== requestId);
      });

      setRequestExitStates((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });

      setAcceptingRequestIds((prev) => prev.filter((activeRequestId) => activeRequestId !== requestId));
      setDecliningRequestIds((prev) => prev.filter((activeRequestId) => activeRequestId !== requestId));

      requestExitTimeoutIdsRef.current = requestExitTimeoutIdsRef.current.filter((idInRef) => idInRef !== timeoutId);
    }, REQUEST_EXIT_ANIMATION_MS);

    requestExitTimeoutIdsRef.current.push(timeoutId);
  };

  const handleAccept = async (requestId) => {
    const acceptedRequest = pendingRequests.find((request) => request.id === requestId);
    const acceptedUser = acceptedRequest?.user;

    if (!acceptedRequest || !acceptedUser) return;

    setRequestActionError('');
    setAcceptingRequestIds((prev) => [...prev, requestId]);
    let scheduledExit = false;

    try {
      await updateMembershipRequestStatus(requestId, 'accepted');

      setGroupData((prev) => {
        if (!prev) return prev;

        const existingUsers = Array.isArray(prev.users) ? prev.users : [];
        const alreadyMember = existingUsers.some((user) => String(user?.id) === String(acceptedUser?.id));

        return {
          ...prev,
          users: alreadyMember ? existingUsers : [...existingUsers, acceptedUser],
        };
      });

      animateAndRemoveRequest(requestId, 'accepted');
      scheduledExit = true;
    } catch (err) {
      setRequestActionError(err.message || 'Failed to accept request');
    } finally {
      if (!scheduledExit) {
        setAcceptingRequestIds((prev) => prev.filter((activeRequestId) => activeRequestId !== requestId));
      }
    }
  };

  const handleDecline = async (requestId) => {
    const declinedRequest = pendingRequests.find((request) => request.id === requestId);
    if (!declinedRequest) return;

    setRequestActionError('');
    setDecliningRequestIds((prev) => [...prev, requestId]);
    let scheduledExit = false;

    try {
      await updateMembershipRequestStatus(requestId, 'declined');

      animateAndRemoveRequest(requestId, 'declined');
      scheduledExit = true;
    } catch (err) {
      setRequestActionError(err.message || 'Failed to decline request');
    } finally {
      if (!scheduledExit) {
        setDecliningRequestIds((prev) => prev.filter((activeRequestId) => activeRequestId !== requestId));
      }
    }
  };

  const handleGroupUpdated = (updatedGroup) => {
    if (!updatedGroup) return;

    setGroupData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...updatedGroup,
        users: Array.isArray(prev.users) ? prev.users : [],
      };
    });
    setIsEditGroupOpen(false);
  };

  const handleConfirmAction = async () => {
    if (!groupData?.id || !confirmAction) return;

    setGroupActionError('');
    setGroupActionLoading(confirmAction);

    try {
      if (confirmAction === 'leave') {
        if (!isCurrentUserMember) {
          setGroupActionError('You are not a member of this group.');
          return;
        }
        await leaveStudyGroup(groupData.id);
        navigate('/groups');
        return;
      }

      if (confirmAction === 'delete') {
        await deleteStudyGroup(groupData.id);
        navigate('/groups');
        return;
      }
    } catch (err) {
      setGroupActionError(err.message || `Failed to ${confirmAction} group`);
    } finally {
      setGroupActionLoading('');
      setConfirmAction('');
    }
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            Error: {error}
          </div>
        </main>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          <p className="text-gray-500 text-lg">Loading group details...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {isEditGroupOpen && (
        <EditGroupModal
          group={groupData}
          onClose={() => setIsEditGroupOpen(false)}
          onUpdated={handleGroupUpdated}
        />
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {confirmAction === 'delete' ? 'Delete Group?' : 'Leave Group?'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {confirmAction === 'delete'
                ? 'This will permanently delete this study group. This action cannot be undone.'
                : 'Are you sure you want to leave this study group? You will be able to rejoin later if you change your mind.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction('')}
                disabled={Boolean(groupActionLoading)}
                className="cursor-pointer px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={Boolean(groupActionLoading)}
                className={`cursor-pointer px-4 py-2 text-sm rounded font-medium disabled:opacity-60 disabled:cursor-not-allowed ${confirmAction === 'delete'
                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
              >
                {groupActionLoading === confirmAction
                  ? confirmAction === 'delete' ? 'Deleting...' : 'Leaving...'
                  : confirmAction === 'delete' ? 'Confirm Delete' : 'Confirm Leave'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/groups" className="text-sm text-indigo-700 hover:text-indigo-800 font-medium">
              ← Back to all groups
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {groupData.group_name || 'Untitled Group'}
            </h1>
          </div>

          {(isCurrentUserMember || isOwner) && (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {isCurrentUserMember && (
                <button
                  type="button"
                  onClick={() => {
                    setGroupActionError('');
                    setConfirmAction('leave');
                  }}
                  disabled={groupActionLoading === 'leave' || groupActionLoading === 'delete'}
                  className="cursor-pointer px-3 py-2 text-sm rounded font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Leave Group
                </button>
              )}

              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsEditGroupOpen(true)}
                  disabled={groupActionLoading === 'leave' || groupActionLoading === 'delete'}
                  className="cursor-pointer px-3 py-2 text-sm rounded font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Edit Group
                </button>
              )}

              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    setGroupActionError('');
                    setConfirmAction('delete');
                  }}
                  disabled={groupActionLoading === 'leave' || groupActionLoading === 'delete'}
                  className="cursor-pointer px-3 py-2 text-sm rounded font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Delete Group
                </button>
              )}
            </div>
          )}
        </div>

        {groupActionError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {groupActionError}
          </div>
        )}

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Goals</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {groupData.goals || 'No group goals listed.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Schedule</p>
              <p className="text-sm text-gray-700">
                {groupData.day_of_week || 'TBD'} · {formatTime(groupData.time)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Meeting Spot</p>
              {isLikelyUrl(groupData.meet_spot) ? (
                <a
                  href={groupData.meet_spot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 break-all"
                >
                  {groupData.meet_spot}
                </a>
              ) : (
                <p className="text-sm text-gray-700 break-all">
                  {groupData.meet_spot || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Classes</p>
            <div className="flex flex-wrap gap-2">
              {classList.length > 0 ? (
                classList.map((classItem) => <ClassPill key={classItem} value={classItem} />)
              ) : (
                <p className="text-sm text-gray-500">No classes listed</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Members ({users.length})
            </p>

            {users.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {users.map((user) => (
                  <div
                    key={user.id || `${groupData.id}-member-${user.name || 'unknown'}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                  >
                    <Avatar
                      src={user.avatar_url}
                      alt={user.name || 'member avatar'}
                      className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || 'Unnamed member'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.major || 'No major'}</p>
                    </div>
                    {user.id === groupData.group_owner && (
                      <span className="ml-auto text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                        Owner
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No members listed</p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Pending Requests ({pendingRequests.length})
            </p>

            {requestActionError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {requestActionError}
              </div>
            )}

            {pendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pendingRequests.map((request) => {
                  const exitState = requestExitStates[request.id];
                  const isRequestUpdating = acceptingRequestIds.includes(request.id) || decliningRequestIds.includes(request.id) || Boolean(exitState);

                  return (
                    <div
                      key={request.id}
                      className={`rounded-lg border p-3 transition-all duration-500 ease-out ${exitState === 'accepted'
                        ? 'opacity-0 -translate-y-1 scale-95 border-green-200 bg-green-50/60'
                        : exitState === 'declined'
                          ? 'opacity-0 translate-y-1 scale-95 border-red-200 bg-red-50/60'
                          : 'opacity-100 translate-y-0 scale-100 border-gray-200 bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar
                          src={request?.user?.avatar_url}
                          alt={request?.user?.name || 'requester avatar'}
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {request?.user?.name || 'Unknown user'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {request?.user?.major || 'No major'}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-3">
                        Requested {request?.created_at ? new Date(request.created_at).toLocaleString() : 'recently'}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { handleAccept(request.id) }}
                          disabled={!isOwner || isRequestUpdating}
                          className="px-3 py-1 text-xs rounded font-medium transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                        >
                          {exitState === 'accepted' ? 'Accepted' : acceptingRequestIds.includes(request.id) ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleDecline(request.id) }}
                          disabled={!isOwner || isRequestUpdating}
                          className="px-3 py-1 text-xs rounded font-medium transition-colors bg-red-50 text-red-700 hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                        >
                          {exitState === 'declined' ? 'Declined' : decliningRequestIds.includes(request.id) ? 'Declining...' : 'Decline'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Pending requests hidden</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GroupViewer;