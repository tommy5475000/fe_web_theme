import { useForm } from "react-hook-form";

import { Button, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { ViewXmlProps } from "./type";


export function ViewXml({ handleClose, rowSelect }: ViewXmlProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            file: ""
        }
    })

    return (
        <form>
            <DialogTitle>View Invoice </DialogTitle>

            {/* <DialogContent>

            </DialogContent> */}

            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button
                    variant='contained'
                    component='label'
                >
                    Upload File Scan
                    <input
                        type="file"
                        hidden
                        accept=".pdf"
                    />
                </Button>
            </DialogActions>
        </form>
    )
}