package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func UploadFile(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		file, _, err := r.FormFile("image")

		var namingFile string
		checkProTopName := r.FormValue("title")
		checkUserName := r.FormValue("name")

		if checkProTopName != "" {
			checkProTopName = strings.ReplaceAll(checkProTopName, " ", "-")
			namingFile = checkProTopName
		} else {
			checkUserName = strings.ReplaceAll(checkUserName, " ", "-")
			namingFile = checkUserName
		}

		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error Retrieving the File")
			return
		}

		defer file.Close()

		const MAX_UPLOAD_SIZE = 10 << 20 // 10MB
		// Parse our multipart form, 10 << 20 specifies a maximum
		// upload of 10 MB files.
		r.ParseMultipartForm(MAX_UPLOAD_SIZE)
		if r.ContentLength > MAX_UPLOAD_SIZE {
			w.WriteHeader(http.StatusBadRequest)
			response := Result{Code: http.StatusBadRequest, Message: "Max size in 1mb"}
			json.NewEncoder(w).Encode(response)
			return
		}

		tempFile, err := ioutil.TempFile("uploads", namingFile+"-*.png")
		if err != nil {
			fmt.Println(err)
			fmt.Println("path upload error")
			json.NewEncoder(w).Encode(err)
			return
		}
		defer tempFile.Close()

		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			fmt.Println(err)
		}

		tempFile.Write(fileBytes)

		data := tempFile.Name()
		//filename := data[8:]

		//ctx := context.WithValue(r.Context(), "dataFile", filename)
		ctx := context.WithValue(r.Context(), "dataFile", data)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
