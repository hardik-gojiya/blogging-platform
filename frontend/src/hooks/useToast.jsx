import { toast } from "react-hot-toast";

export const useToast = () => {
  const showSuccess = (message = "Success!") => toast.success(message);
  const showError = (message = "Something went wrong!") => toast.error(message);
  const showInfo = (message = "Info") => toast(message);

  const showConfirm = ({
    message = "Are you sure?",
    okText = "OK",
    cancelText = "Cancel",
    onOk = () => {},
    onCancel = () => {},
  }) => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg border px-6 py-4 rounded-lg w-[300px]">
        <p className="text-sm text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onCancel();
            }}
            className="text-sm px-3 py-1 text-gray-600 hover:text-gray-800"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onOk();
            }}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {okText}
          </button>
        </div>
      </div>
    ));
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showConfirm,
  };
};
