import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export async function DeleteConfirmation(): Promise<boolean> {
    const SwalDelete = withReactContent(Swal);

    return SwalDelete.fire({
        title: 'Você tem certeza que gostaria de excluir?',
        text: 'Essa alteração não poderá ser desfeita',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            return true;
        } else {
            return false;
        }
    });
}
