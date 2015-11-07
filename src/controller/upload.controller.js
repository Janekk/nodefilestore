import FileViewModel from './../viewmodels/file.viewmodel';
import UploadViewModel from './../viewmodels/upload.viewmodel';
import { FilePickerEventKeys } from './../filepicker/filePicker.directive';

export default class UploadController {
    constructor($scope, $location, dataService) {
        this.$scope = $scope;
        this.$location = $location;
        this.dataService = dataService;

        this.files = [];
        this.isUploading = false;
        this.showResultPannel = false;
        this.upload = undefined;

        this.$scope.$on(FilePickerEventKeys.FilesSelected, (e, args) => {
            e.stopPropagation();

            if (!args || !args.files) {
                return;
            }

            this.isUploading = true;

            // add files to queue
            for (var i = 0; i < args.files.length; i++) {
                var file = args.files[i];
                this.files.push(new FileViewModel(file));
            }

            this.processQueue(0);
        });
    }

    processQueue(index) {
        if (index >= this.files.length) {
            return;
        }

        var file = this.files[index];

        console.log('startUpload()', index);

        this.dataService.uploadFile(file)
            .then(data => { // successful
                console.log('upload finished', data);
                file.isUploadFinished = true;

                this.showResultPannel = true;
                this.upload = new UploadViewModel(data.token, data.expirationDate);

                //this.processQueue(++index);
            }, e => { // error
                console.error(e);
                this.processQueue(++index);
            }, percentage => { // notify
                file.uploadedPercentage = percentage;
            });
    }
}

UploadController.$inject = ['$scope', '$location', 'dataService'];