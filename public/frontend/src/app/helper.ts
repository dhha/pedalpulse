import Swal from "sweetalert2";

export default class Helper{
    static showSuccess(title: string, description: string) {
        Swal.fire({
            title: title,
            text: description,
            icon: "success",
          });
    };

    static showError(error: any) {
        Swal.fire({
            title: "Error",
            text: error.error? error.error.message : "Error",
            icon: "error",
          });
    };

    static showWarning(message: string) {
      Swal.fire({
          title: "Warning",
          text: message,
          icon: "warning",
        });
  };

    static showConfirm(title: string, description: string, callback: any) {
        Swal.fire({
            title: title,
            text: description,
            icon: "question",
            confirmButtonText: 'Yes',
            showCancelButton: true,
          }).then((result) => {
            if(result.value) {
              callback();
            } else {
              console.log('cancel');
            }
          });
    };
}