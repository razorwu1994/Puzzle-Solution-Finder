#include <Timers.au3>

Example()

Func Example()
    HotKeySet("{ESC}", "_Quit")

    Local $hStarttime = _Timer_Init()
	  Do
		 If Mod (Floor(_Timer_Diff($hStarttime)/1000),5) = 0 Then
			MouseClick("left",718,82)

		 EndIf

	  Until _Timer_Diff($hStarttime) > 100000000000000000;
EndFunc   ;==>Example

Func _Quit()
    Exit
EndFunc   ;==>_Quit


