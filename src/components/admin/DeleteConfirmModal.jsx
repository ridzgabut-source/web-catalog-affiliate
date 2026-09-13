import React from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
  itemName = '',
  isDeleting = false,
  error = null,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
            {itemName && (
              <p className="mt-2 text-sm font-bold font-headline text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                "{itemName}"
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 text-left">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
            icon="delete"
          >
            Ya, Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
