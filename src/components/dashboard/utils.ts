export const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    case 'REJECTED':
      return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'Aprobado'
    case 'REJECTED':
      return 'Rechazado'
    case 'PENDING':
      return 'Pendiente'
    default:
      return status
  }
}
