;;;; wiredcraft.asd

(asdf:defsystem #:wiredcraft
  :description "wiredcraft.com backend-test"
  :author "Can Leovinci <can@celwk.com>"
  :version "0.0.1"
  :serial t
  :depends-on (#:celwk
               #:drakma
               #:dexador
               #:smart-server
               ;; #:erp-framework
               #:crypto-shortcuts
               #:postmodern
               #:com.gigamonkeys.json
               #:hunchentoot
               #:hunchensocket)
  :components ((:file "package")
               (:file "framework/defclass")
               (:file "framework/constant")
               (:file "framework/socket")
               (:file "framework/basic")
               (:file "framework/query")
               (:file "framework/member")
               (:file "framework/wechat")
               (:file "framework/message")
               (:file "framework/request")
               (:file "framework/ai")
               (:file "wiredcraft")
               (:file "core/member")))
