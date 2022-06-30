import { Router } from '@angular/router';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  textlist = ['Mike.', 'Student.', 'Dev.'];

  i = 0;
  frontEnd = ['HTML', 'CSS', 'JS', 'TS', 'Angular', 'BS'];
  backEnd = ['NodeJS', 'Express', 'PHP', 'Python'];
  db = ['MySQL', 'MongoDB'];

  observer = new IntersectionObserver(
    (entries) => {
      if (this.i == 0) {
        this.i += 1;
        return;
      }
      const ent = entries[0];
      // console.log(ent.isIntersecting === false)
      let nav = document.querySelector('.nav');
      if (ent.isIntersecting === false) {
        nav?.classList.add('sticky');
        $('.top').show();
      } else {
        nav?.classList.remove('sticky');
        $('.top').hide();
      }
      this.i += 1;
    },
    {
      root: null,
      rootMargin: '',
      threshold: 1,
    }
  );

  @ViewChild('canvas') canvasRef!: ElementRef;
  @ViewChild('scroll', { static: true }) scroll!: ElementRef;
  @ViewChild('sticky', { static: true }) sticky!: ElementRef;

  //* Cube Properties

  @Input() public rotationSpeedX: number = 0.005;

  @Input() public rotationSpeedY: number = 0.005;

  @Input() public size: number = 500;

  //* Stage Properties

  @Input() public cameraZ: number = 100;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private geometry = new THREE.BoxGeometry(1, 1, 1);

  private material = [
    new THREE.MeshBasicMaterial({ color: 0xe35205, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('assets/texture.jpg'),
      side: THREE.DoubleSide,
    }),
  ];

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material[1]);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  /**
   *Animate the cube
   *
   * @private
   * @memberof HomeComponent
   */
  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof HomeComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.cube);
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   *
   * @private
   * @memberof HomeComponent
   */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    // let controls = new OrbitControls(this.camera, this.renderer.domElement)
    let component: HomeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    })();
  }

  constructor(public router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.observer.observe(this.sticky.nativeElement);

    if (this.router.url == '/login') {
      this.router.navigate(['/']);
      this.dialog.open(LoginDialog, {
        width: '500px',
      });
    }
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

  scrollDown() {
    this.scroll.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}

@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
  styleUrls: ['./dialog.scss'],
})
export class LoginDialog {
  @ViewChild('p') p!: ElementRef;

  showP = false;

  toText() {
    this.p.nativeElement.type = 'text';
    this.showP = true;
  }

  toP() {
    this.p.nativeElement.type = 'password';
    this.showP = false;
  }
}
