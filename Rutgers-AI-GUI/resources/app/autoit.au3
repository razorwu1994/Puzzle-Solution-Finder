#include <Timers.au3>

Example()

Func Example()
    HotKeySet("{ESC}", "_Quit")

    Local $hStarttime = _Timer_Init()
	  Do
		 If _Timer_Diff($hStarttime) == 1 Then
			If 1==1 Then
			   MouseClick("left",215,167)
			   If 1==1 Then
			   MouseClick("left",214,80)
			   EndIf
			EndIf
		 ElseIf _Timer_Diff($hStarttime) > 100000000000000000/3 AND _Timer_Diff($hStarttime) < 100000000000000000/3-10000 Then
			If 1==1 Then
			   MouseClick("left",214,80)
			   If 1==1 Then
			   MouseClick("left",215,148)
			   EndIf
			EndIf
		 Else
			;
		 EndIf

		 MouseClick("left",615,79)
	  Until _Timer_Diff($hStarttime) > 100000000000000000;
EndFunc   ;==>Example

Func _Quit()
    Exit
EndFunc   ;==>_Quit
