(in-package #:wiredcraft)


(defclass server-socket (websocket-resource)
  ((name :initarg :name :initform "socket-server" :reader name))
  (:documentation "A user or member socket"))


(defclass the-member (websocket-client)
  ((mmid :accessor member-id)
   (name :accessor member-name)
   (info :accessor member-info)
   (screen :accessor screen-of)
   (ip :accessor member-ip)
   (location :accessor member-location)
   (user-agent :accessor member-agent)
   (session-id :accessor member-session))
  (:documentation "Wcraft members"))

(defclass user-status ()
  ((@create :accessor @create 
            :initarg create-at)
   (@come   :accessor @come
            :initform (get-universal-time) ; (pretty-time)
            :documentation "When was he/she recently came in")
   (@out    :accessor @out
            :documentation "When the user was disconnected/offline lastly, or nil if onlining"
            :initform nil)
   (@duration :accessor @duration
              :initform -1
              :documentation "How long is here")
   (active? :accessor active?
            :initform t
            :documentation "Is this client onlining/active? ")
   (age-online :accessor age-online
               :initform 0
               :documentation "How long the user is keeping online totally for creating?"))
  (:documentation "Detail information of the user. @xxx means a timestamp"))

(defclass wechat-user (websocket-client)
  ((id :accessor user-id)
   (open-id :accessor open-id)
   (name :accessor user-name)  
   (session-id :accessor user-session
               :documentation "For internal database")
   (wechat-session :accessor wechat-session
                   :documentation "Required for payment")
   (agent :accessor wechat-agent)
   (location :accessor user-location
             :initarg location)
   (notify :accessor user-notify
           :initform ())
   (info :accessor user-info :initform ()
              :documentation "Save temporary info for diff request, use plist please")
   (ip :accessor user-ip)
   (status :accessor status-of :initform (make-instance 'user-status)))
  (:documentation "Basic info of WeChat user/client, same to edu system?
Get inherited field: (slot-value uu 'hunchensocket::state)"))

(defgeneric dispose->member (action/broadcast)
  (:documentation "Process action/broadcast of *member* with *key*/*value*/*mmid*/*action*"))
(defgeneric @member-connected ()
  (:documentation "Excute when member connected, Dynamic/Special Variables"))
(defgeneric @member-disconnected ()
  (:documentation "Excute when member disconnected, Dynamic/Special Variables"))


(defgeneric dispose->user (action)
  (:documentation "Process action of *user* with *key*/*value*/*action*"))
(defgeneric @user-init (action)
  (:documentation "Excute when user come in, no matter connect or reconnect"))
(defgeneric @user-connected ()
  (:documentation "Excute when user connected, Dynamic/Special Variables"))
(defgeneric @user-reconnected ()
  (:documentation "Excute when user disconnect sockt and reconnected"))
(defgeneric @user-left ()
  (:documentation "Excute when user left"))



(defgeneric log-request (room)
  (:documentation "Process ACTION in ROOM, it's triggered by CLIENT, with argument of VALUE"))

(defmethod log-request (room)
  ($output "[~S] ~S ~S ~S" *action* room *member* *user*))
