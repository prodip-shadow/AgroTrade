import Swal from "sweetalert2";

// Agricultural styled confirmation dialog
export const confirmAction = async ({
  title = "Are you sure?",
  text = "Do you want to proceed with this action?",
  confirmButtonText = "Yes, proceed",
  cancelButtonText = "Cancel",
  icon = "question",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#059669", // emerald-600
    cancelButtonColor: "#64748b", // slate-500
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: "rounded-3xl border border-border bg-card shadow-2xl font-sans",
      title: "text-foreground font-black tracking-tight text-xl",
      htmlContainer: "text-muted-foreground text-sm font-medium",
      confirmButton: "rounded-xl font-bold px-5 py-2.5 shadow-md",
      cancelButton: "rounded-xl font-bold px-5 py-2.5",
    },
  });

  return result.isConfirmed;
};

// Destructive confirmation dialog (delete user, cancel order, etc.)
export const confirmDestructive = async ({
  title = "Confirm Deletion",
  text = "This action is permanent and cannot be undone.",
  confirmButtonText = "Yes, delete",
  cancelButtonText = "Keep it",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48", // rose-600
    cancelButtonColor: "#64748b",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: "rounded-3xl border border-border bg-card shadow-2xl font-sans",
      title: "text-foreground font-black tracking-tight text-xl",
      htmlContainer: "text-muted-foreground text-sm font-medium",
      confirmButton: "rounded-xl font-bold px-5 py-2.5 shadow-md",
      cancelButton: "rounded-xl font-bold px-5 py-2.5",
    },
  });

  return result.isConfirmed;
};
