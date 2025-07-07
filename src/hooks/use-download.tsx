import axiosInstance from 'src/utils/axios';

export function useDownloadFile() {
  const handleDownload = (
    url: string,
    body: {
      start_time: string;
      end_time: string;
    }
  ) => {
    axiosInstance
      .post(url, body, {
        responseType: 'blob',
      })
      .then((response) => {
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'logs.xlsx';

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }

        const urlBlob = window.URL.createObjectURL(
          new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
        );
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('Error downloading file:', error.message);
      });
  };

  return { handleDownload };
}
