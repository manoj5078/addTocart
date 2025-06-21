from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Cart, CartItem, Product
import json
from django.http import JsonResponse
from .models import Product
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Sum

def product_list(request):
    try:
        products = Product.objects.all()
        product_data = []
        
        for product in products:
            product_data.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': float(product.price),  # Convert to float
                'image': request.build_absolute_uri(product.image.url) if product.image else None
            })
        
        return JsonResponse(product_data, safe=False, encoder=DjangoJSONEncoder)
    
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)



@csrf_exempt
@require_POST
def add_to_cart(request):
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))
        
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key
        
        product = Product.objects.get(id=product_id)
        cart, created = Cart.objects.get_or_create(session_key=session_key)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        # Calculate total quantity in cart
        total_quantity = cart.items.aggregate(total=Sum('quantity'))['total'] or 0
        
        return JsonResponse({
            'success': True,
            'cart_total_items': total_quantity
        })
        
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
def get_cart_count(request):
    if not request.session.session_key:
        return JsonResponse({'cart_total_items': 0})
    
    try:
        cart = Cart.objects.get(session_key=request.session.session_key)
        total_quantity = cart.items.aggregate(total=Sum('quantity'))['total'] or 0
        return JsonResponse({'cart_total_items': total_quantity})
    except Cart.DoesNotExist:
        return JsonResponse({'cart_total_items': 0})