import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { upFile } from 'src/apis/it';

import { showAlert } from 'src/components/alert';

import { ViewXmlForm, ViewXmlProps } from './type';

export function ViewXml({ handleClose, rowSelect }: ViewXmlProps) {
  const queryClient = useQueryClient();
  const id = rowSelect?.id;
  const fileName = rowSelect?.file ?? '';

  const { mutate } = useMutation({
    mutationFn: (value: ViewXmlForm) => upFile(value.id, value.file),
    onError: () => {
      showAlert({ type: 'error', message: 'Quá trình upload file bị lỗi' });
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Đã upload file thành công' });
      queryClient.invalidateQueries({ queryKey: ['dataXml'] });
    },
  });

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!id) {
      showAlert({ type: 'error', message: 'Không xác định được ID hóa đơn' });
      return;
    }

    // Nếu đã có file cũ -> hỏi có ghi đè không
    if (file) {
      Swal.fire({
        title: 'Bạn có muốn ghi đè file cũ?',
        text: `File hiện tại: ${fileName}`,
        showCancelButton: true,
        cancelButtonText: 'Huỷ',
        confirmButtonText: 'Xác nhận',
        heightAuto: false, // FIX 1
        backdrop: true, // FIX 2
      }).then((result) => {
        if (result.isConfirmed) {
          mutate({ id, file });
        }
      });
    } else {
      // Chưa có file -> upload luôn
      mutate({ id, file });
    }
  };

  return (
    <>
      <DialogTitle>
        <h2>View Invoice </h2>
      </DialogTitle>

      <DialogContent>
        {rowSelect?.file ? (
          <>
            {/* <a
              href={`${import.meta.env.VITE_BE_URL}/uploads/invoice-scan/${rowSelect.file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem file scan
            </a> */}
            <iframe
              src={`${import.meta.env.VITE_BE_URL}/uploads/invoice-scan/${encodeURIComponent(
                fileName
              )}`}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          </>
        ) : (
          <div>
            <h4>Chưa có upload file scan</h4>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button variant="contained" component="label">
          Upload File Scan
          <input type="file" hidden accept=".pdf" onChange={handleUploadFile} />
        </Button>
      </DialogActions>
    </>
  );
}
