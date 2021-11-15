(in-package #:wiredcraft)

(defconst +crypt-key+ "#celwk=>savior*#" "Length must be 16/24/32")

(defun id=>code (id)
  "Save in the cookie for user info"
  (crypto-shortcuts:encrypt (write-to-string id) +crypt-key+))

(defun code=>id (code)
  (ignore-errors (read-from-string (crypto-shortcuts:decrypt code +crypt-key+))))

(build-memorized code->id code=>id)



(in-package :com.gigamonkeys.json)
;; For update some third party lib
(defmethod emit-json ((object (eql nil)) stream)
  (write-string "false" stream))

(defmethod json-stringify ((object symbol))
  (unless (keywordp object)
    (=:$output "Error, guy ~S" object)
    (error "Only keywords allowed in JSON-EXPs. Got ~a in package ~a"
           object (package-name (symbol-package object))))
  (celwk:symbol->camel object))	;; => Change the key to JavaScript style -- camel

(in-package :cl-postgres)
(define-condition database-error (error)
  ((error-code :initarg :code :initform nil :reader database-error-code
               :documentation "Code: the SQLSTATE code for the error (see Appendix A). Not localizable. Always present.")
   (message :initarg :message :accessor database-error-message
            :documentation "Message: the primary human-readable error message. This should be accurate but terse (typically one line). Always present.")
   (detail :initarg :detail :initform nil :reader database-error-detail
           :documentation "Detail: an optional secondary error message carrying more detail about the problem. Might run to multiple lines.")
   (hint :initarg :hint :initform nil :reader database-error-hint
         :documentation "Hint: an optional suggestion what to do about the problem.")
   (context :initarg :context :initform nil :reader database-error-context
            :documentation "Where: an indication of the context in which the error occurred. Presently this includes a call stack traceback of active procedural language functions and internally-generated queries. The trace is one entry per line, most recent first."
            )
   (query :initform *current-query* :reader database-error-query
          :documentation "Query that led to the error, if any.")
   (position :initarg :position :initform nil :reader database-error-position
             :documentation "Position: the field value is a decimal ASCII integer, indicating an error cursor position as an index into the original query string. The first character has index 1, and positions are measured in characters not bytes.")
   (cause :initarg :cause :initform nil :reader database-error-cause))
  (:report (lambda (err stream)
             (format stream "~3%~A~%Database error~@[ ~A~]: ~A~@[~&DETAIL: ~A~]~@[~&HINT: ~A~]~@[~&CONTEXT: ~A~]~@[~&QUERY: ~A~]~@[~VT^~]~%~A~%"
                     (celwk:string-repeat "💥  " 30)
                     (database-error-code err)
                     (database-error-message err)
                     (database-error-detail err)
                     (database-error-hint err)
                     (database-error-context err)
                     (database-error-query err)
                     (database-error-position err)
                     (celwk:string-repeat "💥  " 30))))
  (:documentation "This is the condition type that will be used to
signal virtually all database-related errors \(though in some cases
socket errors may be raised when a connection fails on the IP
level)."))

;; connect
;; tool

