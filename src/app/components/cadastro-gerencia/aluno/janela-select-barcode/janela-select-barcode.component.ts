import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AlunoService } from '../service/aluno.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aluno } from '../../../../models/Aluno';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-janela-select-barcode',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './janela-select-barcode.component.html',
  styleUrls: ['./janela-select-barcode.component.css']
})
export class JanelaSelectBarcodeComponent implements OnInit {

  alunos: any[] = [];
  alunosSelecionados: Aluno[] = [];

  constructor(
    public dialogRef: MatDialogRef<JanelaSelectBarcodeComponent>,
    private service: AlunoService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.service.listar().subscribe(alunos => {
      this.alunos = alunos;
      console.log(this.alunos);
    });
  }

  printBarcode() {
    this.alunosSelecionados = this.alunos.filter(aluno => aluno.selecionado);
    if (this.alunosSelecionados.length > 0) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const matriculas = this.alunosSelecionados.map(aluno => aluno.studentCode);

      this.http.post('/api/print-barcode', { matriculas }, { headers, responseType: 'blob' })
        .subscribe(response => {
          console.log('Código de barras enviado para impressão');
          this.snackBar.open('Código de barras enviado para impressão', '', { duration: 5000, panelClass: ['successSnackbar'] });
          this.dialogRef.close();
        }, error => {
          console.error('Erro ao enviar código de barras para impressão', error);
          this.snackBar.open('Erro ao enviar código de barras para impressão', '', { duration: 5000, panelClass: ['errorSnackbar'] });
        });
    } else {
      this.snackBar.open('Nenhum aluno selecionado', '', { duration: 5000, panelClass: ['errorSnackbar'] });
    }
  }
}
