import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'db-graph-age',
  templateUrl: './graph-age.component.html',
  styleUrls: ['./graph-age.component.css']
})

export class GraphAgeComponent implements OnInit {
  chart : any;
  control: any = {
    anoInicial: 1960,
    anoFinal:2017,
    age: 18
  };

  anosIniciais = []
  anosFinais = []
  idadesDisp = []
  firstTime  = true;
  label = [];
  datas =[];

  startYears(){
    for(let i=1950;i<=2018;i++){
      this.anosIniciais.push(i);
      this.anosFinais.push(i);
    }
    for(let j=0;j<=100; j++){
      this.idadesDisp.push(j);
    }
  }

  controlSubmit(form){//pega os dados e passa para ngOnInit
    this.control.anoInicial = parseInt(form.value.anoInicial,10);
    this.control.anoFinal = parseInt(form.value.anoFinal, 10);
    this.control.age = parseInt(form.value.age, 10);
    console.log('AQUI AAA');
    this.ngOnInit();
  }

  constructor(private _brazil: DataService) {  };

  ngOnInit(){
    this.startYears();
    let request;
    let anoInicial = this.control.anoInicial;
    anoInicial -= 1950;//Normalize
    let anoFinal = this.control.anoFinal;
    anoFinal -= 1950;//Normalize
    let age = this.control.age;
    console.log('age', age);
    console.log('final ', anoFinal);
    console.log('inic ', anoInicial);
    this._brazil.populacaoLimitada(age).subscribe(res => {
        console.log('ENKTROU');
        request = res;
        //Aqui o index é o ano (sendo 1950 = 0 e 2000=50 e etc. Dessa forma: ANO = index+1950)
        this.label = [];
        this.datas =[];
        for(var i=anoInicial; i<=anoFinal;i++){
          //Consulta por ano.
          this.label.push(request[i]['year']);
          this.datas.push(request[i]['total'].toString());
        }
        if(this.firstTime) {
          this.chart = new Chart('canvasAge', {
          //Resolver aqui as coisas do grafico.
            type:'line',
            data: {
              labels:this.label,
              datasets: [{
                  data: this.datas,
                  label:'População',
                  borderColor: 'rgba(186, 70, 70, 0.6)',
                  backgroundColor:'rgba(186, 70, 70, 0.2)',
                  fill:true,
                  showLine: true,
              }]
            },
            options:{
              title:{
                display: true,
                text: 'População brasileira com '+age.toString()+ ' entre '+ (anoInicial+1950).toString() + ' e '+ (anoFinal+1950).toString(),
              },
              showLines: true, // disable for all datasets
              legend:{
              },
              scales: {
                xAxes: [{
                  display: true
                }],
                yAxes: [{
                  display: true
                }]
              }
            }
          });
          this.firstTime = false;
        }
        else{
          this.chart.data.datasets[0].data = this.datas;
          console.log(this.chart.data.datasets[0].label);
          console.log('AQUI');
          this.chart.options.title.text = 'População brasileira com '+age.toString()+ ' entre '+ (anoInicial+1950).toString() + ' e '+ (anoFinal+1950).toString();
          this.chart.update();
        }
      });
    };
}