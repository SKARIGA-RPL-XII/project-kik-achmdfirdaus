import { useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import ReusableFormModal from './ui/reusable-modal'
import FormModal from './modal-pengajuan'

type Props = {
    open: boolean
    onClose: () => void
    type: 'masuk' | 'pulang'
}

export default function AbsensiModal({ open, onClose, type }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    function handleFile(e: any) {
        const f = e.target.files[0]
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    function submit(e: any) {
        e.preventDefault()

        if (!file) return

        const form = new FormData()
        form.append('foto', file)

        router.post(`/app/my-absensi/${type}`, form, {
            forceFormData: true,
            onSuccess: onClose
        })
    }

    return (
        <FormModal
            open={open}
            title={type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'}
            onClose={onClose}
            onSubmit={submit}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
                className="w-full"
                required
            />

            {preview && (
                <img
                    src={preview}
                    className="rounded-lg border mt-3"
                />
            )}
        </FormModal>
    )
}
