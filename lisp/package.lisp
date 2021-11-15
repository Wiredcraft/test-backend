;;;; package.lisp

(defpackage #:wiredcraft
  (:nicknames :craft :wcraft)
  (:use #:cl
        #:celwk
        #:hunchentoot
        #:hunchensocket
        #:smart-server
        #:cl-ppcre
        #:postmodern
        #:crypto-shortcuts
        #:com.gigamonkeys.json
        #:sb-thread)
  (:shadowing-import-from :drakma :http-request)
  (:export))
