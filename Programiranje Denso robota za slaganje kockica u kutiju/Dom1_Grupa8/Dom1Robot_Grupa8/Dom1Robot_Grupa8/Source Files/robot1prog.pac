'!TITLE "<Title>"
PROGRAM Robot1Prog

#INCLUDE "DIO_TAB.H" 'Do not delete if you wish to keep Macro namase for IO. Activation (deactivation) iof the output is perfromed as >> SET (RESET) IO[Macro_name] << Alternatively, command >> SET (RESET) IO[number of output] <<'can be used
dim tmpx as double
dim tmpy as double
dim tmprz as double


'=========================== Beginning of the code for communication with camera ====================================
goto *CameraInfo 		'insert this AND the following line when you want to get information from camera
*CameraReply:
'=========================== End of the code for communication with camera ==========================================

'Provera da li je korisnik aktivirao input 15
if io15 then

		takearm
		motor on 

		changework 1
		changetool 1

		dim brojac as integer
		brojac  = 0

        dim pom as integer
		pom = 0

		dim br_kocke as integer
		dim br_polja as integer
		dim br_polja1 as integer
		
		br_kocke  = 0
		br_polja  = 0
		br_polja1 = 0

        'Pomocne promenljive za zahtev2
		dim br0 as integer
		br0 = 0
		dim br1 as integer
		br1 = 0
		dim br2 as integer
		br2 = 0
		dim br3 as integer
        br3 = 0
		dim brojac1 as integer
		brojac1 = 0

        'Niz identifikatora koji su inicijalizovani na 0 a cuvaju br_kockice na odredjenoj poziciji.
		Dim ind(9) As integer
		do 
		ind(brojac) = 0
		brojac = brojac + 1
		loop until brojac>8
		brojac = 0

		move p, p0, s=70
		
		do
		pom = i[brojac]

		'korisnik unosi broj kocke i polja dok ne unese 0 sto tumacimo kao da ne zeli dalji unos
		if pom = 0 then     
			move p, p0, s=70
			motor off
			givearm
		end if

        'Dobijanje  broja kockice i pozicije kockice iz unosa korisnika.
		br_polja1 = pom mod 10
		br_polja = br_polja1 +3

		br_kocke = pom - br_polja1
		br_kocke = br_kocke / 10

        'Ako je identifikator na na poziciji jednak 0 ili br_kockice koju je korisnik zadao da zeli na tu poziciju da stavi onda se izvrsava kod.
		'Zahtev1: Dve kockice razlicitih boja ne smeju biti na istoj poziciji.
		if ind(br_polja1 - 1) = 0 or ind(br_polja1 - 1) = br_kocke then

			approach p, p[br_kocke], 100, s=70 

			move l, @e p[br_kocke], s = 70 

			'picking point
			'hvataljka je aktivirana - zatvorena
			set io24

			delay 500

			depart l, 150, s=10

			'placing point
			approach l, p[br_polja], 150, s=10 
			approach l, p[br_polja], 55.5, s=10

			'hvataljka je deaktivirana - otvorena
			reset io24

		else
			move p, p0, s=70
			motor off
			givearm
		end if

        ind(br_polja1 - 1) = br_kocke

		'Zahtev2: Potrebno je da budu rasporedjene kockice sve tri boje u jednoj iteraciji ili 
		'se preostale kockice rasporedjuju na prazne pozicije ako ih ima na paleti ako nema onda se obustavlja rad robota.
         if brojac = 8 then

		     'Provera da li su sve kockice rasporedjene(ako je brojac razlicit od 0)
			 do
				 select case ind(brojac1)

                 case 0
				 br0 = br0 + 1
				 case 1
				 br1 = br1 + 1
				 case 2
				 br2 = br2 + 1
				 case 3
				 br3 = br3 + 1

				 end select
             
			 brojac1 = brojac1 + 1
			 loop until brojac1 > 8
             
			 brojac1 = 0
             
			 'Provera koje pozicije su prazne i smestanje nerasporedjenih kockica na tu poziciju.
			 do
			    
				'Ako je br0 = 0 nema praznih pozicija -> rad robota se obustavlja
                if br0 = 0 then
					move p, p0, s=70
					motor off
					givearm

			    elseif br1 = 0 then	
				   if ind(brojac1) = 0 then	
						
					approach p, p1, 100, s=70 

					move l, @e p1, s = 70 

					'picking point
					'hvataljka je aktivirana - zatvorena
					set io24

					delay 500

					depart l, 150, s=10

					'placing point
					approach l, p[brojac1 + 1 + 3], 150, s=10 
					approach l, p[brojac1 + 1 + 3], 55.5, s=10

					'hvataljka je deaktivirana - otvorena
					reset io24
                    
					br1 = br1 + 1
					ind(brojac1) = 1

					end if

			 elseif br2 = 0 then
			   if ind(brojac1) = 0 then	
			   		
					approach p, p2, 100, s=70 

					move l, @e p2, s = 70 

					'picking point
					'hvataljka je aktivirana - zatvorena
					set io24

					delay 500

					depart l, 150, s=10

					'placing point
					approach l, p[brojac1 + 1 + 3], 150, s=10 
					approach l, p[brojac1 + 1 + 3], 55.5, s=10

					'hvataljka je deaktivirana - otvorena
					reset io24
                    
					br2 = br2 + 1
					ind(brojac1) = 2

               end if

			elseif br3 = 0 then	
			  if ind(brojac1) = 0 then	
			  	
					approach p, p3, 100, s=70 

					move l, @e p3, s = 70 

					'picking point
					'hvataljka je aktivirana - zatvorena
					set io24

					delay 500

					depart l, 150, s=10

					'placing point
					approach l, p[brojac1 + 1 + 3], 150, s=10 
					approach l, p[brojac1 + 1 + 3], 55.5, s=10

					'hvataljka je deaktivirana - otvorena
					reset io24

					br3 = br3 + 1
					ind(brojac1) = 3

               end if

             end if

             brojac1 = brojac1 + 1
			 loop until brojac1 > 8

             end if

		brojac = brojac + 1
		loop until brojac > 9


		move p, p0, s=70
		motor off
		givearm

else 
'Ako korisnik nije aktivirao io15 ceka se 2s pa se ponovo proverava io15
	delay 2000
end if

END


'================================ Do NOT modify following content ===================================================
*CameraInfo:
'Function provides shape, size and orientation information of the detected object. 
'Function is called using <gosub *CameraInfo> ststement.
'
'Positions (x,y) of the pallet in camera coordinate frame are stored in variables  (f1,f2) 
'Orientation is stored in global float variable f3, and it represents rotation about vertical axis z.
	tmpx = RND(-TIMER)
	tmpy = RND(-TIMER+150)
	tmprz = RND(-TIMER+400)
	
	f1=(tmpx-0.5)*35 	'along wortk table's x-axis
	
	f2=(tmpy-0.5)*50+70 	'along wortk table's y-axis
	
	f3=(tmprz-0.5)*360 	'orientation - Rz
goto *CameraReply
'================================ Do NOT modify preceeding content ==================================================
